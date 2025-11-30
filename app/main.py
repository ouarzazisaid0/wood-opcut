from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from opcut import common, calculate as opcut_calculate
import traceback
import logging
from opcut.common import UnresolvableError

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PanelInput(BaseModel):
    name: str
    width: float
    height: float
    quantity: int = 1
    grain: Literal['horizontal', 'vertical'] = 'vertical'


class ItemInput(BaseModel):
    name: str
    width: float
    height: float
    isRotate: bool
    quantity: int = 1
    grain: Literal['horizontal', 'vertical'] = 'vertical'
    engraved_line: Literal['horizontal', 'vertical', 'none'] = 'none'
    borders: Dict[str, bool] = Field(default_factory=lambda: {
        "top": False, "right": False, "bottom": False, "left": False
    })


class UserParams(BaseModel):
    cut_width: float
    min_initial_usage: bool = False
    panels: List[PanelInput]
    items: List[ItemInput]


class UsedItem(BaseModel):
    item_id: str
    name: str
    width: float
    height: float
    x: float
    y: float
    rotate: bool
    grain: Literal['horizontal', 'vertical'] = 'vertical'
    engraved_line: Literal['horizontal', 'vertical', 'none'] = 'none'
    borders: Dict[str, bool] = Field(default_factory=lambda: {
        "top": False, "right": False, "bottom": False, "left": False
    })


class UnusedArea(BaseModel):
    width: float
    height: float
    x: float
    y: float


class PanelOutput(BaseModel):
    panel_id: str
    panel_name: str
    width: float
    height: float
    used_items: List[UsedItem]
    unused_areas: List[UnusedArea]


class CalculationResponse(BaseModel):
    success: bool
    panels: List[PanelOutput] = Field(default_factory=list)
    cuts: List[str] = Field(default_factory=list)
    summary: Dict[str, int] = Field(default_factory=dict)
    error: Optional[str] = None
    calculation_time: Optional[float] = None


class CuttingOptimizer:
    def __init__(self):
        self.method_map = {
            "greedy": common.Method.GREEDY,
            "forward_greedy": common.Method.FORWARD_GREEDY,
            "greedy_native": common.Method.GREEDY_NATIVE,
            "forward_greedy_native": common.Method.FORWARD_GREEDY_NATIVE
        }

    def _transform_item_for_calculation(self, item: ItemInput, panel: PanelInput) -> Dict[str, Any]:
        """Transform item for cutting calculation - swap width/height if grain is horizontal."""
        if item.grain != panel.grain:
            # For horizontal grain, swap width and height for cutting calculation
            cutting_width = item.height
            cutting_height = item.width
        else:
            # For vertical grain, keep original dimensions
            cutting_width = item.width
            cutting_height = item.height

        return {
            "name": item.name,
            "width": cutting_width,
            "height": cutting_height,
            "isRotate": item.isRotate,
            "quantity": item.quantity,
            "grain": item.grain,
            "engraved_line": item.engraved_line,
            "borders": item.borders,
            "original_width": item.width,  # Store original for later
            "original_height": item.height  # Store original for later
        }

    def _expand_panels(self, panels: List[PanelInput]) -> List[common.Panel]:
        """Expand panels by quantity into individual panel objects."""
        expanded_panels = []
        for panel in panels:
            for i in range(panel.quantity):
                panel_id = f"{panel.name}_{i+1}"
                expanded_panels.append(
                    common.Panel(id=panel_id, width=panel.width, height=panel.height)
                )
        return expanded_panels

    def _expand_items(self, items: List[ItemInput], panel: PanelInput) -> List[common.Item]:
        """Expand items by quantity into individual item objects."""
        expanded_items = []
        for item in items:
            # Transform item for cutting calculation
            transformed_item = self._transform_item_for_calculation(item, panel)
            
            for i in range(item.quantity):
                item_id = f"{item.name}_{i+1}"
                expanded_items.append(
                    common.Item(
                        id=item_id,
                        width=transformed_item["width"],  # Use transformed dimensions
                        height=transformed_item["height"], # Use transformed dimensions
                        can_rotate=item.isRotate
                    )
                )
        return expanded_items

    def _create_item_mapping(self, items: List[ItemInput], panel: PanelInput) -> Dict[str, Dict[str, Any]]:
        """Create a mapping from item_id to complete item details including metadata."""
        item_mapping = {}
        for item in items:
            # Transform item for cutting calculation but keep original metadata
            transformed_item = self._transform_item_for_calculation(item, panel)
            
            for i in range(item.quantity):
                item_id = f"{item.name}_{i+1}"
                item_mapping[item_id] = {
                    "name": item.name,
                    "width": transformed_item["width"],  # Transformed width for cutting
                    "height": transformed_item["height"], # Transformed height for cutting
                    "original_width": item.width,  # Original width for display
                    "original_height": item.height, # Original height for display
                    "can_rotate": item.isRotate,
                    "grain": item.grain,
                    "engraved_line": item.engraved_line,
                    "borders": item.borders
                }
        return item_mapping

    def _create_panel_mapping(self, panels: List[PanelInput]) -> Dict[str, Dict[str, Any]]:
        """Create a mapping from panel_id to panel details."""
        panel_mapping = {}
        for panel in panels:
            for i in range(panel.quantity):
                panel_id = f"{panel.name}_{i+1}"
                panel_mapping[panel_id] = {
                    "name": panel.name,
                    "width": panel.width,
                    "height": panel.height,
                    "grain": panel.grain
                }
        return panel_mapping

    def _build_panel_structure(self, panel_id: str, panel_mapping: Dict) -> Dict[str, Any]:
        """Build the basic panel structure with metadata."""
        panel_data = panel_mapping[panel_id]
        return {
            "panel_id": panel_id,
            "panel_name": panel_data["name"],
            "width": panel_data["width"],
            "height": panel_data["height"],
            "used_items": [],
            "unused_areas": []
        }

    def _transform_used_item_for_display(self, used_item: Dict, item_mapping: Dict, panel: PanelInput) -> UsedItem:
        """Transform used item data back to original dimensions and include all metadata."""
        item_id = used_item["item"]
        item_details = item_mapping.get(item_id, {})
        
        # Get the cutting dimensions from the optimization result
        cutting_width = used_item.get("width", item_details.get("width", 0))
        cutting_height = used_item.get("height", item_details.get("height", 0))
        
        grain = item_details.get("grain", "vertical")
        engrand_line_origin = item_details.get("engraved_line", "none")
        borders = item_details.get("borders", {
                "top": False, "right": False, "bottom": False, "left": False
            })
        
        if grain != panel.grain:
            # Swap engraved line
            if engrand_line_origin == "none":
                engrand_line = "none"
            else:
                engrand_line = "vertical" if engrand_line_origin == "horizontal" else "horizontal"

            # Extract border booleans correctly
            left = borders.get("left", False)
            top = borders.get("top", False)
            right = borders.get("right", False)
            bottom = borders.get("bottom", False)

            # Rotate borders 90° clockwise:
            rotated_borders = {
                "top": left,
                "right": top,
                "bottom": right,
                "left": bottom
            }

            borders = rotated_borders
        else:
            # Grain same, keep original
            engrand_line = engrand_line_origin

        return UsedItem(
            item_id=item_id,
            name=item_details.get("name", ""),
            width=cutting_width,
            height=cutting_height,
            x=used_item["x"],
            y=used_item["y"],
            rotate=used_item["rotate"],
            grain=grain,
            engraved_line=engrand_line,
            borders=borders
        )

    def transform_result(self, result: Dict, user_params: UserParams) -> CalculationResponse:
        """Transform the raw optimization result into a clean frontend-friendly format."""
        try:
            logger.info(f"Transforming result: {result.keys() if result else 'No result'}")
            
            item_mapping = self._create_item_mapping(user_params.items, user_params.panels[0])
            panel_mapping = self._create_panel_mapping(user_params.panels)
            
            panels_dict: Dict[str, Dict[str, Any]] = {}

            # Process used items
            if result and "used" in result:
                for used_item in result["used"]:
                    panel_id = used_item["panel"]
                    
                    if panel_id not in panels_dict:
                        panels_dict[panel_id] = self._build_panel_structure(panel_id, panel_mapping)
                    
                    enriched_item = self._transform_used_item_for_display(used_item, item_mapping, user_params.panels[0])
                    panels_dict[panel_id]["used_items"].append(enriched_item.dict())

            # Process unused areas
            if result and "unused" in result:
                for unused_area in result["unused"]:
                    panel_id = unused_area["panel"]
                    
                    if panel_id not in panels_dict:
                        panels_dict[panel_id] = self._build_panel_structure(panel_id, panel_mapping)
                    
                    panels_dict[panel_id]["unused_areas"].append({
                        "width": unused_area["width"],
                        "height": unused_area["height"],
                        "x": unused_area["x"],
                        "y": unused_area["y"]
                    })

            # Convert to sorted list
            panels_list = [PanelOutput(**panel_data) for panel_data in 
                          sorted(panels_dict.values(), key=lambda x: x["panel_id"])]

            # Handle cuts - some methods might not return cuts
            cuts = result.get("cuts", []) if result else []
            if cuts is None:  # Handle case where cuts is explicitly None
                cuts = []

            # Create summary
            summary = {
                "total_panels_used": len(panels_list),
                "total_items_placed": len(result.get("used", [])) if result else 0,
                "total_unused_areas": len(result.get("unused", [])) if result else 0
            }

            logger.info(f"Transformation complete: {len(panels_list)} panels, {len(cuts)} cuts")

            return CalculationResponse(
                success=True,
                panels=panels_list,
                cuts=cuts,
                summary=summary
            )
        except Exception as e:
            logger.error(f"Error transforming result: {str(e)}")
            logger.error(f"Result data: {result}")
            logger.error(traceback.format_exc())
            raise

    def _increment_panel_quantities(self, user_params: UserParams, increment: int = 1) -> UserParams:
        """Create a new UserParams with incremented panel quantities."""
        import copy
        
        # Create a deep copy of the user_params to avoid modifying the original
        new_params_dict = user_params.dict()
        new_params_dict['panels'] = []
        
        for panel in user_params.panels:
            new_panel_dict = panel.dict()
            new_panel_dict['quantity'] += increment
            new_params_dict['panels'].append(new_panel_dict)
        
        return UserParams(**new_params_dict)

    def _get_total_panel_quantity(self, user_params: UserParams) -> int:
        """Get the total quantity of all panels."""
        return sum(panel.quantity for panel in user_params.panels)

    def calculate(self, user_params: UserParams, method: str) -> CalculationResponse:
        """Perform the cutting optimization calculation with automatic retry when panel quantity < 50."""
        import time
        
        if method not in self.method_map:
            raise ValueError(f"Unknown method: {method}")

        logger.info(f"Starting calculation with method: {method}")
        logger.info(f"Panels: {len(user_params.panels)} types, Items: {len(user_params.items)} types")

        start_time = time.time()
        current_user_params = user_params
        
        while True:
            try:
                # Check if total panel quantity is already at or above 50
                total_panels = self._get_total_panel_quantity(current_user_params)
                if total_panels >= 50:
                    logger.warning(f"Panel quantity already at maximum ({total_panels}), proceeding with calculation")
                
                # Expand inputs
                panels_list = self._expand_panels(current_user_params.panels)
                items_list = self._expand_items(current_user_params.items, current_user_params.panels[0])

                logger.info(f"Calculation attempt with {len(panels_list)} panels and {len(items_list)} items")

                # Prepare optimization parameters
                opcut_params = common.Params(
                    cut_width=current_user_params.cut_width,
                    min_initial_usage=current_user_params.min_initial_usage,
                    panels=panels_list,
                    items=items_list
                )

                logger.info("Starting optimization calculation...")

                # Perform calculation
                opcut_method = self.method_map[method]
                result = opcut_calculate.calculate(opcut_method, opcut_params)
                result_json = common.result_to_json(result)

                calculation_time = time.time() - start_time
                logger.info(f"Calculation completed in {calculation_time:.2f} seconds")
                logger.info(f"Raw result type: {type(result_json)}")
                logger.info(f"Raw result keys: {result_json.keys() if isinstance(result_json, dict) else 'Not a dict'}")

                # Transform result
                transformed_result = self.transform_result(result_json, current_user_params)
                transformed_result.calculation_time = calculation_time
                
                return transformed_result
                
            except UnresolvableError as e:
                calculation_time = time.time() - start_time
                logger.warning(f"UnresolvableError encountered: {str(e)}")
                
                # Check current total panel quantity
                current_total_panels = self._get_total_panel_quantity(current_user_params)
                logger.info(f"Current total panel quantity: {current_total_panels}")
                
                if current_total_panels < 50:
                    # Increment panel quantities and retry
                    current_user_params = self._increment_panel_quantities(current_user_params, increment=1)
                    new_total_panels = self._get_total_panel_quantity(current_user_params)
                    logger.info(f"Increased panel quantity to {new_total_panels}, retrying calculation...")
                else:
                    # Panel quantity already at or above 50, return error
                    logger.error(f"Panel quantity ({current_total_panels}) reached maximum limit (50), cannot retry")
                    return CalculationResponse(
                        success=False,
                        panels=[],
                        cuts=[],
                        summary={},
                        error=f"UnresolvableError: No valid cutting solution found even with {current_total_panels} panels. Try adjusting item dimensions or using different optimization method.",
                        calculation_time=calculation_time
                    )
                    
            except Exception as e:
                calculation_time = time.time() - start_time
                logger.error(f"Calculation failed after {calculation_time:.2f} seconds: {str(e)}")
                logger.error(traceback.format_exc())
                
                # Return more detailed error information for other exceptions
                return CalculationResponse(
                    success=False,
                    panels=[],
                    cuts=[],
                    summary={},
                    error=f"{type(e).__name__}: {str(e)}",
                    calculation_time=calculation_time
                )


# FastAPI App Setup
app = FastAPI(title="Cutting Optimizer API")
optimizer = CuttingOptimizer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/calculate", response_model=CalculationResponse)
async def calculate_optimization(user_params: UserParams, method: str):
    """
    Calculate optimal cutting pattern for panels and items.
    
    - **method**: Optimization algorithm (greedy, forward_greedy, greedy_native, forward_greedy_native)
    - **user_params**: Panel and item specifications with quantities and metadata
    """
    try:
        logger.info(f"Received calculation request for method: {method}")
        logger.info(f"Processing {len(user_params.panels)} panels and {len(user_params.items)} items")
        
        # Log initial panel quantities
        total_panels = sum(panel.quantity for panel in user_params.panels)
        logger.info(f"Initial total panel quantity: {total_panels}")
        
        # Log grain distribution
        horizontal_grain_items = sum(1 for item in user_params.items if item.grain == 'horizontal')
        logger.info(f"Items with horizontal grain: {horizontal_grain_items}/{len(user_params.items)}")
        print(user_params.panels)
        user_params.panels[0].quantity=1
        print(user_params.panels)
        return optimizer.calculate(user_params, method)
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        logger.error(traceback.format_exc())
        return CalculationResponse(
            success=False,
            panels=[],
            cuts=[],
            summary={},
            error=f"API Error: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "cutting-optimizer"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")