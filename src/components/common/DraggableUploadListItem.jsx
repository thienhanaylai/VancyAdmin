// DraggableUploadListItem.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const DraggableUploadListItem = ({ originNode, file }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: file.uid, // Sử dụng uid của file làm ID duy nhất
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move", // Thêm con trỏ di chuyển
  };

  // Thêm style mờ đi khi đang kéo
  if (isDragging) {
    style.opacity = 0.5;
  }

  // originNode là item gốc mà Antd render
  // Chúng ta sẽ bọc nó bằng div của dnd-kit
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {originNode}
    </div>
  );
};
