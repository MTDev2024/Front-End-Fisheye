// FETCH JSON 
export async function getData() {
  const response = await fetch("data/photographers.json");
  const data = await response.json();
  return {
    photographers: data.photographers,
    media: data.media,
  };
}
