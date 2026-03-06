import imagemin from "imagemin";
import webp from "imagemin-webp";

(async () => {
  const files = await imagemin(
    ["public/images/*.{jpg,jpeg,png}"],
    {
      destination: "public/images",
      plugins: [
        webp({ quality: 85 })
      ]
    }
  );

  console.log("✅ Converted images:");
  files.forEach(file => console.log(file.destinationPath));
})();
