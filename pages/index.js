import {useEffect, useState} from 'react'
import Modal from '../components/modal'
import home from "../styles/Home.module.css"

export default function Home() {
  const loadingMessages = [
    "Knock knock...",
    "Who's there?...",
    "Data...",
    "Data who?...",
    "Data is taking a long time to load...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');


  async function fetchData() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_WP_API_POSTS);
        const responseData = await res.json();
        
        if (!responseData) {
          console.error('Data not found.');
          return;
        }

        // Set the data and update the loading state
        setData(responseData);
        setLoading(false);
      } catch (error) {
        // Handle any fetch or JSON parsing errors
        console.error('Error fetching data:', error);
      }
    }

  useEffect(() => {
    fetchData();
  }, []);



  /* loading messages */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 1500);

    if(!loading){
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [loading]);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage('');
    setModalIsOpen(false);
     document.body.style.overflow = 'auto';
  };

  const postHTML = data?.map((post) => {
  let content = [post.content.rendered]

  // Function to extract src attributes of <img> nodes using regular expressions
  function extractImageSrcs(html) {
    const imgSrcs = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      imgSrcs.push(match[1]);
    }
    
    return imgSrcs;
  }
// console.clear()
  // console.log(data[4]);

  function extractText(html) {
    const text = [];
    const textRegex = /\/>([^]*)/g;

    let match;
    while ((match = textRegex.exec(html)) !== null) {
      text.push(match[1]);
    }
    const temporaryElement = document.createElement('div');
    temporaryElement.innerHTML = text;
    const textWithoutTags = temporaryElement.textContent;
    return textWithoutTags;
  }

  // Search each HTML content in the array for <img> nodes and extract src attributes
  const allImgSrcs = content.map(extractImageSrcs);
  const allText = content.map(extractText);

  // Combine all image/Text srcs into a single array
  const foundImageSrcs = [].concat(...allImgSrcs);
  const foundText = [].concat(...allText);

  const imageInfoArray = foundImageSrcs.map((imageUrl, i) => ({
    imageUrl,
    foundText: foundText[i], // Corresponding foundText for the image
  }));

  return (
    <div key={Math.random()}>
      
      {imageInfoArray.map((imageInfo, i) => (
        <img
          key={i}
          src={imageInfo.imageUrl}
          onClick={() => openModal(imageInfo)}
          alt={`Image ${i}`}
        />
      ))}
      <Modal modalIsOpen={modalIsOpen} selectedImage={selectedImage} closeModal={closeModal} />
      
    </div>
  )
})

  // if (loading) {
  //   return <div className="loading">loading images...</div>;
  // }
  //
  if (loading) {
    return <div className="loading">
      {loadingMessages[currentMessageIndex]}
    </div>
  }


  const strapline = "pull data from wordpress backend over json api into nextjs frontend";

  return (
    <>
    
     <title>{strapline}</title>

      <link rel='shortcut icon' href='https://easycss.github.io/favicon/favicon.png' type='image/x-icon' />

    <div className={home.container}>
        
    <p className={home.code}>{strapline}</p>
    
    <div className={home.wrapper}>
      
      {/* { loading ? 
        <>
          <div className="loading">loading images...</div>
          <SkeletonImage /> 
        </>
        : postHTML
      } */}

      {postHTML}

     </div>
      
    </div>

      <div id="admin">
        <a href="https://wp.olk1.com/wp-admin/edit.php" target="_blank">π</a>
      </div>
    
    </>
  )
}