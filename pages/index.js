import {useEffect, useState} from 'react'
import Modal from '../components/modal'
import home from "../styles/Home.module.css"

export default function Home() {
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

  function extractText(html) {
    const text = [];
    
    const textRegex = /<p>([^<]*?)<\/p>/g;
    
    let match;
    while ((match = textRegex.exec(html)) !== null) {
      text.push(match[1]);
    }
    
    return text;
  }

  const allImgSrcs = content.map(extractImageSrcs);
  const allText = content.map(extractText);

  const imageInfoArray = allImgSrcs.map((imageUrl, i) => ({
    imageUrl,
    foundText: allText[i].join('\n')
  }));

  return (
    <div key={Math.random()}>
      
      {imageInfoArray.map((imageInfo, i) => (
        <img
          key={i}
          className={home.imageItem}
          src={imageInfo.imageUrl}
          onClick={() => openModal(imageInfo)}
          alt={`Image ${i}`}
        />
      ))}
      
      <Modal modalIsOpen={modalIsOpen} selectedImage={selectedImage} closeModal={closeModal} />
    </div>
  )
})


  if (loading) {
    // You can render a loading indicator here
    return <div className="loading">loading images...</div>;
  }
  
  const strapline = "pull data from wordpress backend over json api into nextjs frontend";

  return (
     <>
     <title>{strapline}</title>
      <link rel='shortcut icon' href='https://easycss.github.io/favicon/favicon.png' type='image/x-icon' />

      <div className={home.container}>
        
      <p className={home.code}>{strapline}</p>
    
      {/* home.wrapper class added for one image/text per wp post */}
      <div className={home.wrapper}>
        {postHTML}
      </div>
      
      </div>
    </>
  )
}