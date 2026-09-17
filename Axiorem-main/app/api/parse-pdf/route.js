import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('API route called');
    
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');
    const feature = formData.get('feature') || 'lesson';
    
    console.log('FormData received:', { feature, hasPdf: !!pdfFile });
    
    if (!pdfFile) {
      console.log('No PDF file provided');
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    // Get additional form data
    const options = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'pdf' && key !== 'feature') {
        options[key] = value;
      }
    }

    console.log('Options:', options);

    // For now, return a placeholder response
    // You'll need to implement actual PDF processing logic here
    let responseData;
    switch (feature) {
      case 'presentation':
        responseData = { 
          slides: [
            { title: 'Slide 1', content: 'This is a placeholder slide' },
            { title: 'Slide 2', content: 'This is another placeholder slide' }
          ]
        };
        break;
      
      case 'summarization':
        responseData = { 
          text: 'This is a placeholder summary of PDF content.' 
        };
        break;
      
      case 'lesson':
        responseData = { 
          text: JSON.stringify({
            title: 'Sample Lesson Plan',
            objectives: ['Objective 1', 'Objective 2'],
            content: 'Lesson content placeholder'
          })
        };
        break;
      
      case 'assignment':
        responseData = { 
          questions: [
            { question: 'Sample question 1?', options: ['A', 'B', 'C', 'D'], answer: 'A' },
            { question: 'Sample question 2?', options: ['A', 'B', 'C', 'D'], answer: 'B' }
          ]
        };
        break;
      
      case 'flashcards':
        responseData = { 
          flashcards: [
            { front: 'Term 1', back: 'Definition 1' },
            { front: 'Term 2', back: 'Definition 2' }
          ]
        };
        break;
      
      default:
        responseData = { 
          text: 'Default placeholder response' 
        };
    }

    console.log('Returning response:', responseData);
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Error in parse-pdf API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
