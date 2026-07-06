import { Helmet } from "react-helmet-async";

export default function Head({
  title,
  description,
  image,
  url,
  keywords,
  type = "website"
}) {
  return (
    <Helmet>
      
      <title>{title}</title>
      <meta name="description" content={description} />

      {keywords && (
        <meta name="keywords" content={keywords} />
      )}

      {url && <link rel="canonical" href={url} />}

      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />

      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}