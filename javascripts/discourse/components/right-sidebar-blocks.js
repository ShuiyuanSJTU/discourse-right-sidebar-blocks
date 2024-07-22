import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { getOwner } from "@ember/application";
import { action } from "@ember/object";

const componentNameOverrides = {
  // avoids name collision with core's custom-html component
  "custom-html": "custom-html-rsb",
};

export default class RightSidebarBlocks extends Component {
  @tracked blocks = [];
  @tracked hidden = false;

  constructor() {
    super(...arguments);

    const blocksArray = [];
    this.hidden = localStorage.getItem("right-sidebar-blocks-hidden") === "true";
    if (this.hidden) {
      return;
    }

    JSON.parse(settings.blocks).forEach((block) => {
      block.internalName =
        block.name in componentNameOverrides
          ? componentNameOverrides[block.name]
          : block.name;

      if (getOwner(this).hasRegistration(`component:${block.internalName}`)) {
        block.classNames = `rs-component rs-${block.name}`;
        block.parsedParams = {};
        if (block.params) {
          block.params.forEach((p) => {
            block.parsedParams[p.name] = p.value;
          });
        }
        blocksArray.push(block);
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `The component "${block.name}" was not found, please update the configuration for discourse-right-sidebar-blocks.`
        );
      }
    });

    this.blocks = blocksArray;
  }

  @action
  hide() {
    this.hidden = true;
    // save hidden state to local storage
    localStorage.setItem("right-sidebar-blocks-hidden", "true");
  }
}
