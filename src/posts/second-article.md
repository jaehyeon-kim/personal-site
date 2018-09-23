---
title: Article Two from MD
description: This is another article
created: 2017-10-01
updated:
status: publish
---

## Let's start with an H2
And then some text

And then some code:

```html
<div class="container">
  <div class="main">
    <div class="article insert-wp-tags-here">
      <h1>Title</h1>
      <div class="article-content">
        <p class="intro">Intro Text</p>
        <p></p>
      </div>
      <div class="article-meta"></div>
    </div>
  </div>
</div>
```

And mroe code

```r
#
library(magrittr)
library(dplyr)

sep <- function(s, delim=',') {
    strsplit(s, delim) %>% 
        unlist() %>% 
        unique() %>% 
        paste(collapse=',')
}
```

```javascript
'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
```

```python
#
s = "Python syntax highlighting"
print s
```

Here's an image:

![alt text](/static/logo.png "testing")
