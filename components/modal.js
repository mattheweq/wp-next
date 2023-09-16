export default function Modal({ modalIsOpen, selectedImage, closeModal }) {
  if (!modalIsOpen) return null;

  function decodeEntitiesAndReplace(html) {
    return html?.replace(/&#215;/g, ' x ').replace(/&#\d+;/g, (match) => {
      const code = match.substring(2, match.length - 1); // Extract the entity code
      return String.fromCharCode(code); // Convert entity code to character
    });
  }

  const foundText = decodeEntitiesAndReplace(selectedImage.foundText);

  return (
    <div className={`modal ${modalIsOpen ? 'is-open' : ''}`}>
        <div className="modal-content" onClick={closeModal}>
          <span className="close-btn" onClick={closeModal}>&times;</span>
          <img src={selectedImage.imageUrl} alt="Modal Image" />
          <p className="modal-image-text">{foundText}</p>
        </div>
      </div>
  );
}