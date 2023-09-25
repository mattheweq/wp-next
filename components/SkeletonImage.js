import home from "../styles/Home.module.css";

const SkeletonImage = () => {
  const numberOfImages = 6;

  return (
    <>
      {Array.from({ length: numberOfImages }, (_, index) => (
        <div key={index} className={`${home.loadAni} home.imageItem`}>
          <img src="skeleton.png" alt="skeleton" />
        </div>
      ))}
    </>
  );
};

export default SkeletonImage;
