import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { concat } from "@ember/helper";
import { action } from "@ember/object";
import { htmlSafe } from "@ember/template";
import categoryLink from "discourse/helpers/category-link";
import formatDate from "discourse/helpers/format-date";
import replaceEmoji from "discourse/helpers/replace-emoji";
import { ajax } from "discourse/lib/ajax";
import Category from "discourse/models/category";
import Topic from "discourse/models/topic";
import { i18n } from "discourse-i18n";

export default class HotTopics extends Component {
  @tracked hotTopics = null;
  @tracked hidden = false;
  @tracked loading = true;

  constructor() {
    super(...arguments);

    const count = this.args?.params?.count || 5;
    const hotTopicsUrl = "/hot.json";

    ajax(hotTopicsUrl)
      .then((data) => {
        let results = [];
        results = data.topic_list.topics.filter((topic) => {
          return !topic.pinned;
        });
        this.hotTopics = results.slice(0, count);
        this.hotTopics = this.hotTopics.map((topic) => {
          topic["category"] = Category.findById(topic.category_id);
          return Topic.create(topic);
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.hotTopics = null;
  }

  @action
  hide() {
    this.hidden = true;
  }

  <template>
    <h3 class="hot-topics__heading">
      {{i18n (themePrefix "top_topics.heading")}}
    </h3>

    {{#if this.loading}}
      <div class="spinner"></div>
    {{/if}}

    <div class="hot-topics__container">
      {{#each this.hotTopics as |topic|}}
        <div class="hot-topics__topic">
          <div class="hot-topics__col">
            <div class="hot-topics__topic-title">
              <a
                class="hot-topics__topic-link"
                href={{concat "/t/" topic.slug "/" topic.id}}
              >
                {{htmlSafe (replaceEmoji topic.title)}}
              </a>
            </div>
          </div>
          <div class="hot-topics__col">
            <span class="hot-topics__date">
              {{formatDate topic.last_posted_at format="tiny"}}
            </span>
          </div>

          <div class="hot-topics__category">
            {{categoryLink topic.category}}
          </div>
        </div>

      {{/each}}
    </div>
  </template>
}
