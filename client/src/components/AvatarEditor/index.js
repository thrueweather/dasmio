import React, { Component } from "react";
import AvatarEditor from "react-avatar-editor";
import { Button } from "semantic-ui-react";
import { Mutation } from "react-apollo";

import minus from "assets/minus-circle-outline.svg";
import plus from "assets/plus-circle-outline.svg";
import reload from "assets/reload-circle-outline.svg";

import { addToGallery } from "api/mutations";

import "./styles.scss";

export default class SimpleAvatarEditor extends Component {
  state = {
    scale: [1.5],
    rotate: 0,
  };

  onClickSave = (uploadImage) => {
    if (this.editor) {
      const canvas = this.editor.getImage();

      this.props.handleSaveImage(canvas, uploadImage);
    }
  };

  setEditorRef = (editor) => (this.editor = editor);

  handleChangeRotate = () => this.setState({ rotate: this.state.rotate + 90 });

  render() {
    const { width, height, borderRadius, image, border } = this.props;
    const { scale, rotate } = this.state;
    const value = parseFloat(scale);
    return (
      <div className="avatar-editor-wrapp">
        <AvatarEditor
          ref={this.setEditorRef}
          image={image || this.props.avatar.image}
          width={200}
          height={200}
          scale={scale}
          rotate={rotate}
          borderRadius={borderRadius}
          crossOrigin="anonymous"
        />
        <div className="text-left" style={{ width: 250, margin: "auto" }}>
          <p>Zoom and Rotation</p>
          <div
            className="d-flex justify-content-between"
            style={{ paddingTop: "20px" }}
          >
            <img
              src={minus}
              className="pointer mr-3"
              onClick={() =>
                this.setState({
                  scale: value > 1 ? [value - 0.1] : scale,
                })
              }
              alt=""
            />
            <div style={{ width: 106 }}>
              <input
                type="range"
                className="w-100"
                min={1}
                max={3}
                value={scale}
                step={0.1}
                onChange={(e) => this.setState({ scale: e.target.value })}
              />
            </div>
            <img
              src={plus}
              className="pointer ml-3"
              onClick={() =>
                this.setState({
                  scale: value < 100 ? [value + 0.1] : scale,
                })
              }
              alt=""
            />
            <img
              src={reload}
              className="ml-3 pointer"
              onClick={this.handleChangeRotate}
              alt=""
            />
          </div>
          <Mutation mutation={addToGallery}>
            {(uploadImage, { loading }) => {
              return (
                <Button
                  className="primary-button w-100"
                  loading={loading}
                  disabled={loading}
                  onClick={() => this.onClickSave(uploadImage)}
                  style={{ marginTop: 18 }}
                >
                  Save
                </Button>
              );
            }}
          </Mutation>
        </div>
      </div>
    );
  }
}
