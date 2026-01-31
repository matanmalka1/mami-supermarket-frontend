import React from "react";

const InventoryTableEmptyRow: React.FC = () => (
  <tr>
    <td colSpan={5} className="text-center text-gray-400 py-12 font-bold ">
      No inventory found.
    </td>
  </tr>
);

export default InventoryTableEmptyRow;
