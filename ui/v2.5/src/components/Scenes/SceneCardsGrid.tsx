import React from "react";
import * as GQL from "src/core/generated-graphql";
import { SceneQueue } from "src/models/sceneQueue";
import { SceneCard } from "./SceneCard";

interface ISceneCardsGrid {
  scenes: GQL.SlimSceneDataFragment[];
  queue?: SceneQueue;
  selectedIds: Set<string>;
  zoomIndex: number;
  onSelectChange: (id: string, selected: boolean, shiftKey: boolean) => void;
}

export const SceneCardsGrid: React.FC<ISceneCardsGrid> = ({
  scenes,
  queue,
  selectedIds,
  zoomIndex,
  onSelectChange,
}) => {
  const [touchPreviewActive, setTouchPreviewActive] = React.useState("");
  function handleTouchPreview(key: string) {
    setTouchPreviewActive(key);
  }
  const touchEnabled = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return (
    <div className="row justify-content-center">
      {scenes.map((scene, index) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          queue={queue}
          index={index}
          zoomIndex={zoomIndex}
          selecting={selectedIds.size > 0}
          selected={selectedIds.has(scene.id)}
          onSelectedChanged={(selected: boolean, shiftKey: boolean) =>
            onSelectChange(scene.id, selected, shiftKey)
          }
          touchEnabled={touchEnabled}
          isTouchPreviewActive={touchEnabled && touchPreviewActive === scene.id}
          onTouchPreview={() => handleTouchPreview(scene.id)}
        />
      ))}
    </div>
  );
};
