// export const exerciseOptions = {
//   method: "GET",
//   headers: {
//     "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
//     "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
//   },
// }

// export const youtubeOptions = {
//   method: "GET",
//   headers: {
//     "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
//     "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
//   },
// }

// export const fetchData = async (url, options) => {
//   try {
//     const res = await fetch(url, options)
//     const data = await res.json()

//     return data
//   } catch (error) {
//     console.log(error.message)
//   }
// }

export const exerciseOptions = {
  method: "GET",
  url: "https://exercisedb.p.rapidapi.com/exercises/bodyPart/back",
  params: { limit: "10" },
  headers: {
    "X-RapidAPI-Key": "e7d7614529mshf3b0e6977befcc6p13700fjsn7c359e421cda",
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
  },
};

try {
  const response = await axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);
}

export const youtubeOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "33939205a2msh42c870be6be2d70p1aabc5jsnee15fcc24dc5",
    "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
  },
};

export const fetchData = async (url, options) => {
  try {
    const res = await fetch(url, options);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error.message);
  }
};
