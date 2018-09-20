<template>
  <div v-html="convertedAndSanitizedHtml" class="markdown-body" v-bind:class="{ overwrite: dark }"></div>
</template>

<script>
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
export default {
  name: 'MarkdownViewer',
  props: {
    text: String,
    dark: Boolean
  },
  data () {
    return {
    }
  },
  computed: {
    convertedAndSanitizedHtml() {
      let md = new MarkdownIt()
      return md.render(sanitizeHtml(this.text))
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
