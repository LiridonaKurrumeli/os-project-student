const fs = require("fs");
const path = require("path");

let optimize;
try {
  const svgo = require("svgo");
  optimize = svgo.optimize;
} catch (error) {
  console.log("⚠️ svgo not installed, will use basic SVG processing");
  optimize = null;
}

const iconsPath = path.join(__dirname, "../src/assets/icons");
const iconComponentPath = path.join(
  __dirname,
  "../src/components/shared/Icon/Icon.generated.tsx",
);

const svgoConfig = {
  plugins: [
    { name: "cleanupAttrs", params: { beautify: false } },
    { name: "removeDoctype" },
    { name: "removeXMLProcInst" },
    { name: "removeComments" },
    { name: "removeMetadata" },
    { name: "removeTitle" },
    { name: "removeDesc" },
    { name: "removeUselessDefs" },
    { name: "removeEditorsNSData" },
    { name: "removeEmptyAttrs" },
    { name: "removeHiddenElems" },
    { name: "removeEmptyText" },
    { name: "removeEmptyContainers" },
    { name: "removeViewBox", params: { removeViewBox: false } },
    { name: "cleanupEnableBackground" },
    { name: "convertStyleToAttrs" },
    { name: "convertColors" },
    { name: "convertPathData" },
    { name: "convertTransform" },
    { name: "removeUnknownsAndDefaults" },
    { name: "removeNonInheritableGroupAttrs" },
    { name: "removeUselessStrokeAndFill" },
    { name: "removeUnusedNS" },
    { name: "cleanupIds" },
    { name: "cleanupNumericValues" },
    { name: "moveElemsAttrsToGroup" },
    { name: "moveGroupAttrsToElems" },
    { name: "collapseGroups" },
    { name: "mergePaths" },
    { name: "convertShapeToPath" },
    { name: "sortAttrs" },
    { name: "removeDimensions" },
  ],
};

function cleanSvgContent(svgContent) {
  return svgContent
    .replace(/class="([^"]*)"/g, 'className="$1"')
    .replace(/fill-rule/g, "fillRule")
    .replace(/clip-rule/g, "clipRule")
    .replace(/clip-path/g, "clipPath")
    .replace(/xlink:href/g, "xlinkHref")
    .replace(/fill-opacity/g, "fillOpacity")
    .replace(/stroke-width/g, "strokeWidth")
    .replace(/stroke-linecap/g, "strokeLinecap")
    .replace(/stroke-linejoin/g, "strokeLinejoin")
    .replace(/stroke-miterlimit/g, "strokeMiterlimit");
}

async function run() {
  console.log("🔧 Generating icons...\n");

  const outputDir = path.dirname(iconComponentPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let svgFiles = [];
  try {
    svgFiles = fs
      .readdirSync(iconsPath)
      .filter((f) => f !== "." && f.endsWith(".svg"));
    console.log(`📁 Found ${svgFiles.length} SVG files:`, svgFiles, "\n");
  } catch (error) {
    console.error("❌ Error reading icons directory:", error.message);
    process.exit(1);
  }

  if (svgFiles.length === 0) {
    console.log("⚠️ No SVG files found in src/assets/icons/");
    console.log(
      "💡 Add SVG files to src/assets/icons/ and run this script again",
    );
    process.exit(0);
  }

  const icons = [];
  const errors = [];

  for (const iconFileName of svgFiles) {
    try {
      const iconFileData = fs.readFileSync(
        path.resolve(iconsPath, iconFileName),
        "utf8",
      );
      let svgContent = iconFileData;

      if (optimize) {
        try {
          const result = await optimize(svgContent, {
            path: iconFileName,
            plugins: svgoConfig.plugins,
          });
          if (result && result.data) {
            svgContent = result.data;
          }
        } catch (err) {
          console.log(
            `⚠️ Could not optimize ${iconFileName}, using original: ${err.message}`,
          );
        }
      }

      let cleanSvg = svgContent.replace(/\s+/g, " ").trim();

      if (!cleanSvg.includes("xmlns")) {
        cleanSvg = cleanSvg.replace(
          "<svg",
          '<svg xmlns="http://www.w3.org/2000/svg"',
        );
      }

      cleanSvg = cleanSvg.replace(/<svg([^>]*)>/, (match, attrs) => {
        let newAttrs = attrs;
        newAttrs = newAttrs.replace(
          /stroke-width="([^"]*)"/g,
          'strokeWidth="$1"',
        );
        newAttrs = newAttrs.replace(/fill-rule="([^"]*)"/g, 'fillRule="$1"');
        newAttrs = newAttrs.replace(/clip-rule="([^"]*)"/g, 'clipRule="$1"');
        newAttrs = newAttrs.replace(
          /stroke-linecap="([^"]*)"/g,
          'strokeLinecap="$1"',
        );
        newAttrs = newAttrs.replace(
          /stroke-linejoin="([^"]*)"/g,
          'strokeLinejoin="$1"',
        );
        newAttrs = newAttrs.replace(
          /stroke-miterlimit="([^"]*)"/g,
          'strokeMiterlimit="$1"',
        );
        return `<svg${newAttrs}>`;
      });

      const iconName = iconFileName.replace(".svg", "");

      icons.push({
        icon: iconName,
        svg: cleanSvg,
      });

      console.log(`✅ Processed: ${iconFileName} -> ${iconName}`);
    } catch (error) {
      errors.push(`${iconFileName}: ${error.message}`);
      console.error(`❌ Error processing ${iconFileName}:`, error.message);
    }
  }

  if (errors.length > 0) {
    console.error("\n⚠️ Errors encountered:", errors);
  }

  if (icons.length === 0) {
    console.error("❌ No icons were successfully processed!");
    process.exit(1);
  }

  const iconComponent = [
    `//\n`,
    `// WARNING\n`,
    `//\n`,
    `// Do not make manual changes to this file.\n`,
    `// This file was generated by generate-icons.js\n`,
    `//\n`,
    `\n\n`,
    `/**\n`,
    ` * A list of all available icons in the icon set.\n`,
    ` */\n`,
    "export type IconDefinition = ",
    icons.map((i) => `'${i.icon}'`).join(" | "),
    `;\n\n`,
    `export const availableIcons: IconDefinition[] = [`,
    icons.map((i) => `'${i.icon}'`).join(", "),
    `];\n\n`,
    `export const IconSvg = {\n`,
    icons.map((i) => `  '${i.icon}': ${i.svg},\n`).join(""),
    `};\n`,
  ];

  try {
    fs.writeFileSync(iconComponentPath, iconComponent.join(""));
    console.log(`\n✅ Successfully generated ${icons.length} icons:`);
    console.log(`   📄 Output: ${iconComponentPath}`);
    console.log(`   🎨 Icons: ${icons.map((i) => i.icon).join(", ")}`);
  } catch (error) {
    console.error("❌ Error writing file:", error.message);
    process.exit(1);
  }
}

run();
