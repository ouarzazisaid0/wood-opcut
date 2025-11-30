// TODO docs
const draggers = [];
export function draggerMouseDownHandler(createMoveHandlerCb) {
    return evt => {
        const moveHandler = createMoveHandlerCb(evt);
        if (!moveHandler)
            return;
        draggers.push({
            initX: evt.screenX,
            initY: evt.screenY,
            moveHandler: moveHandler
        });
    };
}
document.addEventListener('mousemove', evt => {
    for (const dragger of draggers) {
        const dx = evt.screenX - dragger.initX;
        const dy = evt.screenY - dragger.initY;
        dragger.moveHandler(evt, dx, dy);
    }
});
document.addEventListener('mouseup', () => {
    draggers.splice(0);
});
