
function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDH',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}
function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function createAIButtonWithDropdown() {
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'T-I J-J5-Ji hG T-I-atl L3';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.marginRight = '8px';
    buttonContainer.style.position = 'relative';

    // Create AI-Reply button
    const button = document.createElement('button');
    button.className = 'T-I J-J5-Ji hG T-I-atl L3 ai-reply-button';
    button.textContent = 'AI-Reply';
    button.style.flex = '1';
    button.style.border = 'none';
    button.style.background = '#1a73e8';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '8px 0 0 8px';

    // Create dropdown
    const dropdown = document.createElement('select');
    dropdown.className = 'ai-tone-dropdown';
    dropdown.style.border = 'none';
    dropdown.style.borderLeft = '1px solid #ccc';
    dropdown.style.padding = '0 8px';
    dropdown.style.background = '#1a73e8';
    dropdown.style.color = 'white';
    dropdown.style.cursor = 'pointer';
    dropdown.style.borderRadius = '0 8px 8px 0';

    // Add tone options
    const tones = ['Professional', 'Casual', 'Friendly'];
    tones.forEach((tone) => {
        const option = document.createElement('option');
        option.value = tone.toLowerCase();
        option.textContent = tone;
        dropdown.appendChild(option);
    });

    // Append button and dropdown to the container
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(dropdown);

    // Add functionality to the button
    button.addEventListener('click', async () => {
        try {
            button.textContent = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const selectedTone = dropdown.value; // Get selected tone

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone,
                }),
            });

            if (!response.ok) {
                throw new Error('API REQUEST FAILED');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.log('Compose box not found');
            }
        } catch (error) {
            console.log(error);
            alert('Failed to generate reply');
        } finally {
            button.textContent = 'AI-Reply';
            button.disabled = false;
        }
    });

    return buttonContainer;
}

function injectButton() {
    console.log('Injecting button...');
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log('Toolbar not found');
        return;
    }

    console.log('Toolbar found, creating AI button with dropdown');
    const aiButtonWithDropdown = createAIButtonWithDropdown();
    toolbar.insertBefore(aiButtonWithDropdown, toolbar.firstChild);
}


const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        //  added nodes to an array
        const addedNodes = Array.from(mutation.addedNodes);

        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))

        );


        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500); // Delay the button injection to ensure the DOM is ready
        }
    }
});

// Start observing 
observer.observe(document.body, {
    childList: true,
    subtree: true
});
