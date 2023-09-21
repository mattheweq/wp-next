import {useEffect, useState} from 'react'
import Modal from '../components/Modal'
import SkeletonImage from '../components/SkeletonImage'
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

        setData(responseData);
        setLoading(false);

      } catch (error) {
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


// RENDER CONTENT
  const postHTML = data?.map((post) => {
  let content = [post.content.rendered]

  const allImgSrcs = content.map(extractImageSrcs);
  const allText = content.map(extractText);

  const imageInfoArray = allImgSrcs.map((imageUrl, i) => ({
    imageUrl,
    foundText: allText[i].join('\n')
  }));

  return (
    <div key={Math.random()}>
      {
        imageInfoArray.map((imageInfo, i) => (
          <div key={i} className={home.imageItem}>
            <img
              src={imageInfo.imageUrl}
              onLoad={() => setLoading(false)}
              onClick={() => openModal(imageInfo)}
              alt={`Image ${i}`}
            />
          </div>
        ))
      }

      <Modal modalIsOpen={modalIsOpen} selectedImage={selectedImage} closeModal={closeModal} />
    </div>
  )
})

  // if (loading) {
  //   return <div className="loading">loading images...</div>;
  // }
  
  const strapline = "pull data from wordpress backend over json api into nextjs frontend";

  return (
     <>
     <title>{strapline}</title>

      <link rel='shortcut icon' href='https://easycss.github.io/favicon/favicon.png' type='image/x-icon' />

    <div className={home.container}>
        
      <p className={home.code}>{strapline}</p>
    
      <div className={home.wrapper}>
        { loading ? 
          <>
            <div className="loading"></div>
            <SkeletonImage /> 
          </>
          : postHTML
        }
      </div>
      
    </div>

      <div id="admin">
        <a href="https://wp.olk1.com/wp-admin/edit.php" target="_blank">π</a>
      </div>
    </>
  )
}