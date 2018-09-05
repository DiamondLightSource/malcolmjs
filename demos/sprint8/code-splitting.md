# Code splitting

1. The bundle started at 1.5MB gzipped.
1. Run `npm run analyze` to see the report of the bundle size.
1. The largest parts were `plotly`, `elkJS`, and material UI icons
1. Using dynamic imports, webpack automatically splits the bundle for us. This means `plotly` is only downloaded if you view a graph.
1. I have also put in better referencing of icons so only the icons we use are included in the bundle.
1. Rendering the icons on the layout also used a large library so that is also dynamically imported.


The bundle sizes are now:

```
File sizes after gzip:

  818.78 KB  build\static\js\1.75e7c948.chunk.js
  356.92 KB  build\static\js\2.028053fb.chunk.js
  274.78 KB  build\static\js\main.8f81d48d.js
  71.25 KB   build\static\js\0.bc29ab6d.chunk.js
  33.98 KB   build\a374da6817a8f14561db.worker.js
  1.58 KB    build\static\css\main.9d803583.css
```