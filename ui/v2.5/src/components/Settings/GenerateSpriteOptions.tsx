import React from "react";
import { useIntl } from "react-intl";
import { Form } from "react-bootstrap";
import * as GQL from "src/core/generated-graphql";

export type SpriteGenerationSettingsInput = Pick<
  GQL.ConfigGeneralInput,
  | "spriteWidthPxLandscape"
  | "spriteWidthPxPortrait"
  | "spriteChunkIntervalSeconds"
  | "spriteChunkMinimum"
>;

interface ISpriteGenerationInput {
  value: SpriteGenerationSettingsInput;
  setValue: (v: SpriteGenerationSettingsInput) => void;
}

export const SpriteGenerationInput: React.FC<ISpriteGenerationInput> = ({
  value,
  setValue,
}) => {
  const intl = useIntl();

  function set(v: Partial<SpriteGenerationSettingsInput>) {
    setValue({
      ...value,
      ...v,
    });
  }

  const {
    spriteWidthPxLandscape,
    spriteWidthPxPortrait,
    spriteChunkIntervalSeconds,
    spriteChunkMinimum,
  } = value;

  return (
    <div>
      <Form.Group id="width-px-landscape">
        <h6>
          {intl.formatMessage({
            id: "dialogs.scene_gen.sprite_generation.width_px_landscape_head",
          })}
        </h6>
        <Form.Control
          className="text-input"
          type="number"
          value={spriteWidthPxLandscape?.toString() ?? 1}
          min={1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            set({
              spriteWidthPxLandscape: Number.parseInt(
                e.currentTarget.value || "160",
                10
              ),
            })
          }
        />
        <Form.Text className="text-muted">
          {intl.formatMessage({
            id: "dialogs.scene_gen.sprite_generation.width_px_landscape_body",
          })}
        </Form.Text>
      </Form.Group>
      <Form.Group id="width-px-portrait">
        <h6>
          {intl.formatMessage({
            id: "dialogs.scene_gen.sprite_generation.width_px_portrait_head",
          })}
        </h6>
        <Form.Control
          className="text-input"
          type="number"
          value={spriteWidthPxPortrait?.toString() ?? 1}
          min={1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            set({
              spriteWidthPxPortrait: Number.parseInt(
                e.currentTarget.value || "80",
                10
              ),
            })
          }
        />
        <Form.Text className="text-muted">
          {intl.formatMessage({
            id: "dialogs.scene_gen.sprite_generation.width_px_portrait_body",
          })}
        </Form.Text>
      </Form.Group>
      <Form.Group id="chunk-interval-seconds">
        <h6>
          {intl.formatMessage({
            id:
              "dialogs.scene_gen.sprite_generation.chunk_interval_seconds_head",
          })}
        </h6>
        <Form.Control
          className="text-input"
          type="number"
          value={spriteChunkIntervalSeconds?.toString() ?? 1}
          min={1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            set({
              spriteChunkIntervalSeconds: Number.parseInt(
                e.currentTarget.value || "10",
                10
              ),
            })
          }
        />
        <Form.Text className="text-muted">
          {intl.formatMessage({
            id:
              "dialogs.scene_gen.sprite_generation.chunk_interval_seconds_body",
          })}
        </Form.Text>
      </Form.Group>
      <Form.Group id="chunk-minimum">
        <h6>
          {intl.formatMessage({
            id: "dialogs.scene_gen.sprite_generation.chunk_minimum_head",
          })}
        </h6>
        <Form.Control
          className="text-input"
          type="number"
          value={spriteChunkMinimum?.toString() ?? 1}
          min={1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            set({
              spriteChunkMinimum: Number.parseInt(
                e.currentTarget.value || "25",
                10
              ),
            })
          }
        />
        <Form.Text className="text-muted">
          {intl.formatMessage({
            id: "dialogs.scene_gen.sprite_generation.chunk_minimum_body",
          })}
        </Form.Text>
      </Form.Group>
    </div>
  );
};
