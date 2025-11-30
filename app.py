from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import Dict

from opcut import common, calculate as opcut_calculate

app = FastAPI()


class PanelModel(BaseModel):
    width: float
    height: float


class ItemModel(BaseModel):
    width: float
    height: float
    can_rotate: bool


class ParamsModel(BaseModel):
    cut_width: float
    min_initial_usage: bool = False
    panels: Dict[str, PanelModel]
    items: Dict[str, ItemModel]


@app.post("/calculate")
def calculate_job(params: ParamsModel, method: str = Query(..., enum=["greedy", "forward_greedy", "greedy_native", "forward_greedy_native"])):
    try:
        # Convert panels/items to opcut.common objects
        panels_list = [common.Panel(id=k, width=v.width, height=v.height) for k, v in params.panels.items()]
        items_list = [common.Item(id=k, width=v.width, height=v.height, can_rotate=v.can_rotate) for k, v in params.items.items()]

        opcut_params = common.Params(
            cut_width=params.cut_width,
            min_initial_usage=params.min_initial_usage,
            panels=panels_list,
            items=items_list
        )

        method_map = {
            "greedy": common.Method.GREEDY,
            "forward_greedy": common.Method.FORWARD_GREEDY,
            "greedy_native": common.Method.GREEDY_NATIVE,
            "forward_greedy_native": common.Method.FORWARD_GREEDY_NATIVE
        }

        opcut_method = method_map[method]
        result = opcut_calculate.calculate(opcut_method, opcut_params)
        return common.result_to_json(result)

    except Exception as e:
        return {"error": str(e)}
