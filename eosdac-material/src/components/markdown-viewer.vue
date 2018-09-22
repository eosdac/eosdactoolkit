<template>
<div v-html="convertedAndSanitizedHtml" class="markdown-body" v-bind:class="{ overwrite: dark }"></div>
</template>

<script>
import sanitizeHtml from 'sanitize-html'
import marked from 'marked'
export default {
  name: 'MarkdownViewer',
  props: {
    text: String,
    dark: Boolean,
    blackList: Boolean,
    tags: Array
  },
  data() {
    return {
      allowedDefaultTags: sanitizeHtml.defaults.allowedTags
    }
  },
  computed: {
    convertedAndSanitizedHtml() {
      let allowedHtmlTags = ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'
      ]
      if (this.tags && this.tags.length) {
        if (this.blackList) {
          for (let i = 0; i < this.tags.length; i++) {
            allowedHtmlTags.splice(allowedHtmlTags.indexOf(this.tags[i]), 1)
          }
        } else {
          allowedHtmlTags = this.tags
        }
      }
      return sanitizeHtml(marked(this.text, { sanitize: true }), {
        allowedTags: allowedHtmlTags
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.overwrite {
  background: none !important;
  color: rgba(255,255,255,0.8) !important;
  // transition: all 0.1s linear;
}
.overwrite h1, .overwrite h2{
  color: #fff;
  // transition: all 0.1s linear;
}
.overwrite td, .overwrite th {
  background: $dark !important;
  // transition: all 0.1s linear;
}

</style>
