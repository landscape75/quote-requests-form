
import { Draggable } from "react-beautiful-dnd";
import { TrashIcon } from "@heroicons/react/outline";

export default function LineItem(props) {
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    display: isDragging ? "table" : "",
    background: isDragging ? "HoneyDew" : "transparent",
    ...draggableStyle,
  });

/*   const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "HoneyDew" : "lightgrey",
    padding: grid,
    width: 250,
  }); */

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
          // className={`${snapshot.isDragging ? 'bg-gray-100' : 'bg-white'}`}
        >
          <td className="text-center border border-t-0 border-b-0 border-l-0 border-r-0 p-2 text-sm text-gray-400">
            {props.id + 1}
          </td>
          <td className="py-2 border border-gray-100 border-t-0 border-b-0 border-l-0 border-r-0">
            <input
              name="description"
              type="text"
              placeholder="Item Description"
              className="bg-white text-gray-700 text-sm placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
              value={props.item.description}
              onChange={props.handleLineItemChange(props.id)}
            />
          </td>
          <td className="py-2 border border-gray-100 border-t-0 border-b-0 border-l-0 border-r-0">
            <input
              name="quantity"
              type="text"
              placeholder="Quantity"
              className="bg-white text-sm text-gray-700 placeholder-gray-500 placeholder-opacity-25 text-center focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
              value={props.item.quantity}
              onChange={props.handleLineItemChange(props.id)}
            />
          </td>
          <td className="py-2 border border-gray-100 border-t-0 border-b-0 border-l-0 border-r-0">
            <input
              name="unit"
              id="unit"
              list="units"
              type="text"
              placeholder="Unit"
              className="bg-white text-gray-700 text-sm placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
              value={props.item.unit}
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
              className="text-gray-300 hover:text-red-600 disabled:opacity-20 relative inline-flex items-center px-1 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 focus:ring-white"
              onClick={props.handleRemoveLineItem(props.id)}
            >
              <span></span>
              <TrashIcon
                className="h-6 w-6 ml-0"
                aria-hidden="true"
              />
            </button>
          </td>
        </tr>
      )}
    </Draggable>
  );
}
