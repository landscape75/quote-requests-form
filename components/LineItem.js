import { Draggable } from "react-beautiful-dnd";
import { TrashIcon, DotsVerticalIcon } from "@heroicons/react/outline";

export default function LineItem(props) {
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    display: isDragging ? "table" : "",
    background: isDragging ? "HoneyDew" : "transparent",
    ...draggableStyle,
  });

  return (
    <Draggable draggableId={props.id + "id"} index={props.index}>
      {(provided, snapshot) => (
        <tr
          key={props.id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          tabIndex="-1"
        >
          <td className="text-left border border-t-0 border-b-0 border-l-0 border-r-0 py-2 px-0 text-sm text-gray-400">
            <div className="inline-flex align-middle">
              <div className="text-left">
                <DotsVerticalIcon
                  className="h-5 w-5 ml-0 text-lc-green hover:text-lc-yellow mr-0"
                  aria-hidden="true"
                />
              </div>
            </div>
          </td>
          <td className="py-2 border border-gray-100 border-t-0 border-b-0 border-l-0 border-r-0">
            <input
              name="description"
              type="text"
              placeholder="Item Description"
              autoComplete="off"
              className="bg-white text-gray-700 text-sm placeholder-gray-500 px-2 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
              value={props.item.description}
              onChange={props.handleLineItemChange(props.id)}
            />
          </td>
          <td className="py-2 border border-gray-100 border-t-0 border-b-0 border-l-0 border-r-0">
            <input
              name="quantity"
              type="text"
              placeholder="Quantity"
              autoComplete="off"
              className="bg-white text-sm text-gray-700 placeholder-gray-500 px-2 placeholder-opacity-25 text-center focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
              value={props.item.quantity}
              onChange={props.handleLineItemChange(props.id)}
            />
          </td>
          <td className="py-2 border border-gray-100 border-t-0 border-b-0 border-l-0 border-r-0">
            <input
              name="uom"
              id="uom"
              list="units"
              type="text"
              placeholder="Unit"
              autoComplete="off"
              className="bg-white text-gray-700 text-sm placeholder-gray-500 px-2 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
              value={props.item.uom}
              onChange={props.handleLineItemChange(props.id)}
            />
            <datalist id="units">
              <option value="Pieces"></option>
              <option value="Cubic Yards"></option>
              <option value="Sq.Ft."></option>
              <option value="Lin.Ft."></option>
              <option value="Sq.M."></option>
              <option value="Lin.M."></option>
              <option value="lbs"></option>
            </datalist>
          </td>
          <td className="text-center px-2 py-2 border border-gray-300 border-r-0 border-l-0 border-t-0 border-b-0">
            <button
              type="button"
              disabled={props.itemCount == 1}
              className="text-lc-green font-normal hover:text-lc-yellow focus:text-green-500 focus:outline-none disabled:opacity-20 relative inline-flex items-center px-1 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-50 focus:z-10 focus:ring-lc-yellow focus:border-lc-yellow "
              onClick={props.handleRemoveLineItem(props.id)}
            >
              <span></span>
              <TrashIcon className="h-6 w-6 ml-0" aria-hidden="true" />
            </button>
          </td>
        </tr>
      )}
    </Draggable>
  );
}
