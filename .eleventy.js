const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const Image = require("@11ty/eleventy-img");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Copy static files
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({"src/static": "."});
  eleventyConfig.addPassthroughCopy({"src/assets/js": "assets/js"});

  // CSS processing
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function(inputContent, inputPath) {
      if (inputPath !== "./src/assets/css/main.css") {
        return;
      }

      const postcss = require("postcss");
      const tailwindcss = require("tailwindcss");
      const autoprefixer = require("autoprefixer");

      let plugins = [tailwindcss, autoprefixer];
      if (process.env.NODE_ENV === "production") {
        const cssnano = require("cssnano");
        plugins.push(cssnano);
      }

      return async () => {
        let result = await postcss(plugins).process(inputContent, {
          from: inputPath,
        });
        return result.css;
      };
    }
  });

  // Watch for changes
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  // Markdown configuration
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Filters
  eleventyConfig.addFilter("dateDisplay", function(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  eleventyConfig.addFilter("date", function(date, format) {
    const d = new Date(date);
    if (format === '%Y-%m-%d') {
      return d.toISOString().split('T')[0];
    }
    return d.toISOString();
  });

  eleventyConfig.addFilter("readingTime", function(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  });

  // Word count filter for JSON-LD
  eleventyConfig.addFilter("wordcount", function(content) {
    if (!content) return 0;
    return content.split(/\s+/).filter(Boolean).length;
  });

  // JSON escape filter for safe embedding in JSON-LD
  eleventyConfig.addFilter("jsonEscape", function(str) {
    if (!str) return "";
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  });

  // Head filter for blog sidebar
  eleventyConfig.addFilter("head", function(array, n) {
    if (!Array.isArray(array) || array.length === 0) return [];
    if (n < 0) return array.slice(n);
    return array.slice(0, n);
  });

  // Image shortcode with WebP optimization
  eleventyConfig.addAsyncShortcode("image", async function(src, alt, sizes = "100vw", className = "") {
    if(alt === undefined) {
      throw new Error(`Missing \`alt\` on image from: ${src}`);
    }

    let metadata = await Image(src, {
      widths: [300, 600, 900, 1200, 1600],
      formats: ["webp", "jpeg"],
      outputDir: "_site/assets/images/",
      urlPath: "/assets/images/",
      sharpWebpOptions: {
        quality: 80,
        effort: 6
      },
      sharpJpegOptions: {
        quality: 85,
        progressive: true
      }
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
      class: className || "w-full h-auto"
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

  // Image URL filter for getting optimized image URLs
  eleventyConfig.addAsyncFilter("imageUrl", async function(src, width = 1600) {
    let metadata = await Image(src, {
      widths: [300, 600, 900, 1200, 1600],
      formats: ["webp", "jpeg"],
      outputDir: "_site/assets/images/",
      urlPath: "/assets/images/",
      sharpWebpOptions: {
        quality: 80,
        effort: 6
      },
      sharpJpegOptions: {
        quality: 85,
        progressive: true
      }
    });

    // Return the WebP version at the requested width, fallback to JPEG
    if (metadata.webp && metadata.webp.find(img => img.width === width)) {
      return metadata.webp.find(img => img.width === width).url;
    } else if (metadata.jpeg && metadata.jpeg.find(img => img.width === width)) {
      return metadata.jpeg.find(img => img.width === width).url;
    } else {
      // Fallback to the largest available image
      const allImages = [...(metadata.webp || []), ...(metadata.jpeg || [])];
      return allImages.sort((a, b) => b.width - a.width)[0]?.url || src;
    }
  });

  // Collections
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md").reverse();
  });

  // Base URL filter for multi-domain builds
  eleventyConfig.addFilter("url", function(url) {
    const baseUrl = process.env.ELEVENTY_BASE_URL || "";
    if (!url || url === "/") return baseUrl + "/";
    return baseUrl + url;
  });

  // Absolute URL filter
  eleventyConfig.addFilter("absoluteUrl", function(url, base) {
    try {
      return new URL(url, base).toString();
    } catch(e) {
      console.log(`Trying to convert ${url} to be an absolute url with base ${base} and failed.`);
      return url;
    }
  });

  // HTML minification in production
  if (process.env.NODE_ENV === "production") {
    const htmlmin = require("html-minifier");
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        });
        return minified;
      }
      return content;
    });
  }

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
