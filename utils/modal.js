// Function to create and show the modal
export function createModal({ title, message, htmlContent, css, onConfirm, noConfirm }) {
    // Create modal background
    const modalBackground = document.createElement('div');
    modalBackground.style.position = 'fixed';
    modalBackground.style.top = '0';
    modalBackground.style.left = '0';
    modalBackground.style.width = '100%';
    modalBackground.style.height = '100%';
    modalBackground.style.backgroundColor = 'rgba(51, 51, 51, 0.6)';
    modalBackground.style.backdropFilter = 'blur(10px)';
    modalBackground.style.display = 'flex';
    modalBackground.style.justifyContent = 'center';
    modalBackground.style.alignItems = 'center';
    modalBackground.style.zIndex = '1000';

    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.style.maxWidth = '80%';
    modalContent.style.maxHeight = '80%';
    modalContent.style.width = 'auto';
    modalContent.style.height = 'auto';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.borderRadius = '8px';
    modalContent.style.overflow = 'hidden';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';

    // Create title div (blue background)
    const modalTitleDiv = document.createElement('div');
    modalTitleDiv.style.backgroundColor = '#0e3b7a';
    modalTitleDiv.style.padding = '15px';
    modalTitleDiv.style.position = 'relative';
    modalTitleDiv.style.display = 'flex';
    modalTitleDiv.style.alignItems = 'center';
    modalTitleDiv.style.justifyContent = 'space-between';

    const modalTitle = document.createElement('p');
    modalTitle.textContent = title || 'Confirmation';
    modalTitle.style.fontWeight = 'bold';
    modalTitle.style.fontSize = '1.5rem';
    modalTitle.style.color = '#fff';
    modalTitle.style.margin = '0';

    // Create content div (white background)
    const modalContentArea = document.createElement('div');
    modalContentArea.style.backgroundColor = '#fff';
    modalContentArea.style.padding = '2rem';
    modalContentArea.style.textAlign = 'left';

    // Handle message or custom HTML content
    if (htmlContent) {
        modalContentArea.innerHTML = htmlContent; // Inject custom HTML
    } else {
        const modalMessage = document.createElement('p');
        modalMessage.textContent = message ? message : !message && noConfirm ? "Request successful" : 'Are you sure?';
        modalMessage.style.marginTop = '0';
        modalMessage.style.marginBottom = '0';
        modalContentArea.appendChild(modalMessage);
    }

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.style.border = '1px solid #f1f1f1';
    closeButton.style.borderRadius = '5px';
    closeButton.textContent = '×';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#fff';
    closeButton.style.padding = '0 5px';
    closeButton.style.boxShadow = '0 2px 4px rgba(200, 200, 100, 0.2)';
    closeButton.onclick = () => closeModal(modalBackground);

    // Create buttons container (only if no custom HTML)
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '1rem';
    buttonContainer.style.marginTop = '1.5rem';

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '0.5rem 1.5rem';
    cancelButton.style.backgroundColor = '#e0e0e0';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.onclick = () => closeModal(modalBackground);
    buttonContainer.appendChild(cancelButton);

    // Yes button (only if noConfirm is false and no custom HTML)
    if (!noConfirm && !htmlContent) {
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

    // Append custom CSS if provided
    if (css) {
        const style = document.createElement('style');
        style.textContent = css;
        modalContent.appendChild(style);
    }

    // Assemble the modal
    modalTitleDiv.appendChild(modalTitle);
    modalTitleDiv.appendChild(closeButton);
    if (!htmlContent) modalContentArea.appendChild(buttonContainer); // Only append buttons if no custom HTML
    modalContent.appendChild(modalTitleDiv);
    modalContent.appendChild(modalContentArea);
    modalBackground.appendChild(modalContent);

    // Append modal to the body
    document.body.appendChild(modalBackground);
}

// Function to close the modal
function closeModal(modal) {
    modal.style.display = 'none';
}

// Function to show the modal
export function showModal(options) {
    createModal(options);
}