import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { CopyAllRounded, SendRounded } from '@mui/icons-material'; // Import icons
import './App.css';

function App() {

  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');


 


  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("https://itchy-bovid-rohit-karma-2f23a9d7.koyeb.app/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError("Failed to generate email reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant='h3'
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4,
        }}
      >
        Email Reply Writer
      </Typography>

      {/* Input Box */}
      <Box
        sx={{
          width: '80%', // Full width
          mx: 'auto', // Center horizontally
          mt: 4,
          p: 4,
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
        }}
      >
        <TextField
          fullWidth
          sx={{ mb: 3 }}
          multiline
          rows={8} // Set the number of rows for the input field
          variant='outlined'
          label="Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          InputProps={{
            style: {
              borderRadius: '2px',
            }
          }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone || ''}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
            sx={{ borderRadius: '12px' }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
            boxShadow: '0px 4px 10px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565C0, #388E3C)',
              boxShadow: '0px 6px 15px rgba(25, 118, 210, 0.4)',
            }
          }}
          startIcon={<SendRounded />}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Generate Reply"}
        </Button>
      </Box>

      {error && (
        <Typography
          color='error'
          sx={{
            mb: 2,
            textAlign: 'center',
            mt: 3,
            p: 2,
            borderRadius: '12px',
            backgroundColor: '#ffebee',
          }}
        >
          {error}
        </Typography>
      )}

      {/* Output Box */}
      {generatedReply && (
        <Box
          sx={{
            width: '80%', // Full width
            mx: 'auto', // Center horizontally
            mt: 4,
            p: 4,
            border: '1px solid #e0e0e0',
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant='h6'
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8} // Set the same number of rows for the output field
            variant='outlined'
            value={generatedReply || ''}
            inputProps={{ readOnly: true }}
            sx={{ mb: 2, borderRadius: '2px' }}
          />

          <Button
            variant='outlined'
            onClick={() => navigator.clipboard.writeText(generatedReply)}
            sx={{
              mt: 2,
              borderRadius: '12px',
              fontWeight: 'bold',
              color: 'primary.main',
              borderColor: 'primary.main',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
                color: 'white',
                borderColor: 'primary.main',
              }
            }}
            startIcon={<CopyAllRounded />}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;