export default function Modal({ modalIsOpen, selectedImage, closeModal }) {
  if (!modalIsOpen) return null;

  return (
    <div className={`modal ${modalIsOpen ? 'is-open' : ''}`}>
        <div className="modal-content" onClick={closeModal}>
          <span className="close-btn" onClick={closeModal}>&times;</span>
          <img className="modal-image" src={selectedImage.imageUrl} alt="Modal Image" />
          <pre>{selectedImage.foundText}</pre>
        </div>
      </div>
  );
}