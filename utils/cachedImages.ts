import cloudinary from "./cloudinary";

interface CloudinarySearchResult {
  resources: Array<{
    public_id: string
    format: string
    width: number
    height: number
    [key: string]: unknown
  }>
  [key: string]: unknown
}

let cachedResults: CloudinarySearchResult | null = null;

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    cachedResults = fetchedResults;
  }

  return cachedResults;
}
