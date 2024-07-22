import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import Category from "discourse/models/category";
import Topic from "discourse/models/topic";

export default class HotTopics extends Component {
  @tracked hotTopics = null;
  @tracked hidden = false;

  constructor() {
    super(...arguments);

    const count = this.args?.params?.count || 5;
    const hotTopicsUrl = "/hot.json";

    ajax(hotTopicsUrl).then((data) => {
      let results = [];
      results = data.topic_list.topics.filter((topic) => {
        return !topic.pinned;
      });
      this.hotTopics = results.slice(0, count);
      this.hotTopics = this.hotTopics.map((topic) => {
        topic["category"] = Category.findById(topic.category_id);
        return Topic.create(topic);
      });
    });
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.topTopics = null;
  }

  @action
  hide() {
    this.hidden = true;
  }
}
