// Function to create and show the modal
export function createModal({ title, message, onConfirm, noConfirm }) {
    // Create modal elements dynamically
    const modalBackground = document.createElement('div');
    modalBackground.style.position = 'absolute';
    modalBackground.style.top = 0;
    modalBackground.style.left = 0;
    modalBackground.style.width = '100%';
    modalBackground.style.height = '100%';
    modalBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalBackground.style.display = 'flex';
    modalBackground.style.justifyContent = 'center';
    modalBackground.style.alignItems = 'center';
    modalBackground.style.zIndex = '1000';
    modalBackground.style.backgroundColor = 'rgba(51, 51, 51, 0.6)'; // Semi-transparent dark background
    modalBackground.style.backdropFilter = 'blur(10px)';

    const modalContent = document.createElement('div');
    modalContent.style.background = 'linear-gradient(to bottom, #1856B4 25%, #fff 25%)';
    modalContent.style.padding = '2rem';
    modalContent.style.borderRadius = '8px';
    modalContent.style.textAlign = 'left';
    modalContent.style.position = 'relative';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '450px';
    modalContent.boxShadow= '0 4px 8px rgba(0, 0, 0, 0.5)'
    modalContent.style.paddingTop = '4rem';




    const modalTitle = document.createElement('p');
    modalTitle.textContent = title || 'Confirmation';
    modalTitle.style.fontWeight = 'bold';
    modalTitle.style.fontSize = '1.5rem';
    modalTitle.style.color = "#fff"
    modalTitle.style.position = 'absolute';
    modalTitle.style.top = '10px';
    modalTitle.style.left = '10px';



    const modalMessage = document.createElement('p');
    modalMessage.textContent = message || 'Are you sure?';
    modalMessage.style.marginTop = '1rem';

    const closeButton = document.createElement('button');
    closeButton.style.border = '1px solid #f1f1f1'
    closeButton.style.borderRadius = '5px'
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => closeModal(modalBackground);
    closeButton.style.color = '#fff'
    closeButton.style.padding = '0 5px'
    closeButton.style.boxShadow= '0 2px 4px rgba(200, 200, 100, 0.2)'




    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '1rem';
    buttonContainer.style.marginTop = '1.5rem';

    // Cancel button behavior changes based on noConfirm flag
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '0.5rem 1.5rem';
    cancelButton.style.backgroundColor = '#e0e0e0';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.onclick = () => {
        closeModal(modalBackground); // Always close the modal when Cancel is clicked
    };

    buttonContainer.appendChild(cancelButton);
    if (!noConfirm) {
        // Only render the "Yes" button if noConfirm is not true
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.style.padding = '0.5rem 1.5rem';
        yesButton.style.backgroundColor = '#007bff';
        yesButton.style.color = 'white';
        yesButton.style.border = 'none';
        yesButton.style.borderRadius = '4px';
        yesButton.style.cursor = 'pointer';
        yesButton.onclick = () => {
            if (onConfirm) onConfirm();
            closeModal(modalBackground);
        };

        buttonContainer.appendChild(yesButton);
    }

    // Append elements to the modal
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(buttonContainer);
    modalBackground.appendChild(modalContent);

    // Append modal to the body
    document.body.appendChild(modalBackground);
}

// Function to close the modal (sets display to 'none' instead of removing)
function closeModal(modal) {
    modal.style.display = 'none'; // Hide the modal
}

// Function to show the modal
export function showModal(options) {
    createModal(options)
}