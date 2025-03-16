// This is a mock OpenAI client for demonstration purposes
// In a production environment, API calls should be made through a backend service

const MOCK_API_KEY = "sk-mock-openai-key-for-demonstration-only";

// This function simulates an API call to generate a roadmap
export const generateRoadmap = async (
  careerGoal: string
): Promise<any> => {
  console.log(`Simulating API call with key: ${MOCK_API_KEY}`);
  console.log(`Generating roadmap for: ${careerGoal}`);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Return mock data based on career input
  if (careerGoal.toLowerCase().includes("software") || 
      careerGoal.toLowerCase().includes("developer") || 
      careerGoal.toLowerCase().includes("engineer")) {
    return {
      title: "Software Engineer",
      steps: [
        {
          title: "Learn Programming Fundamentals",
          description: "Master a programming language like Python or JavaScript and understand basic concepts of programming.",
          resources: [
            { name: "CS50: Introduction to Computer Science", link: "https://www.edx.org/course/cs50s-introduction-to-computer-science" },
            { name: "JavaScript.info", link: "https://javascript.info/" }
          ]
        },
        {
          title: "Web Development Basics",
          description: "Learn HTML, CSS, and JavaScript to build interactive websites.",
          resources: [
            { name: "MDN Web Docs", link: "https://developer.mozilla.org/en-US/" },
            { name: "freeCodeCamp Web Responsive Design", link: "https://www.freecodecamp.org/learn/responsive-web-design/" }
          ]
        },
        {
          title: "Learn a Framework",
          description: "Master a modern JavaScript framework like React, Angular, or Vue.",
          resources: [
            { name: "React Documentation", link: "https://reactjs.org/docs/getting-started.html" },
            { name: "Vue.js Guide", link: "https://vuejs.org/guide/introduction.html" }
          ]
        },
        {
          title: "Backend Development",
          description: "Learn server-side programming with Node.js, Express, or another backend technology.",
          resources: [
            { name: "Node.js Documentation", link: "https://nodejs.org/en/docs/" },
            { name: "Express.js Guide", link: "https://expressjs.com/en/guide/routing.html" }
          ]
        },
        {
          title: "Databases",
          description: "Learn SQL and NoSQL databases like MySQL, PostgreSQL, or MongoDB.",
          resources: [
            { name: "SQL Tutorial - W3Schools", link: "https://www.w3schools.com/sql/" },
            { name: "MongoDB University", link: "https://university.mongodb.com/" }
          ]
        },
        {
          title: "Deploy Your Projects",
          description: "Learn to deploy applications using cloud services like AWS, Azure, or Heroku.",
          resources: [
            { name: "AWS Free Tier", link: "https://aws.amazon.com/free/" },
            { name: "Heroku Documentation", link: "https://devcenter.heroku.com/" }
          ]
        },
        {
          title: "Practice & Build Portfolio",
          description: "Create personal projects and contribute to open source to build your portfolio.",
          resources: [
            { name: "GitHub", link: "https://github.com/" },
            { name: "HackerRank", link: "https://www.hackerrank.com/" }
          ]
        }
      ]
    };
  } else if (careerGoal.toLowerCase().includes("data") || 
             careerGoal.toLowerCase().includes("analyst") || 
             careerGoal.toLowerCase().includes("scientist")) {
    return {
      title: "Data Scientist",
      steps: [
        {
          title: "Learn Programming Basics",
          description: "Focus on Python programming language which is widely used in data science.",
          resources: [
            { name: "Python for Everybody - Coursera", link: "https://www.coursera.org/specializations/python" },
            { name: "Python Documentation", link: "https://docs.python.org/3/" }
          ]
        },
        {
          title: "Mathematics Foundations",
          description: "Build a strong foundation in statistics, linear algebra, and calculus.",
          resources: [
            { name: "Khan Academy - Linear Algebra", link: "https://www.khanacademy.org/math/linear-algebra" },
            { name: "Statistics and Probability - Khan Academy", link: "https://www.khanacademy.org/math/statistics-probability" }
          ]
        },
        {
          title: "Data Analysis Libraries",
          description: "Learn pandas, NumPy, and other data manipulation libraries.",
          resources: [
            { name: "Pandas Documentation", link: "https://pandas.pydata.org/docs/" },
            { name: "NumPy Documentation", link: "https://numpy.org/doc/stable/" }
          ]
        },
        {
          title: "Data Visualization",
          description: "Master visualization libraries like Matplotlib, Seaborn, and Plotly.",
          resources: [
            { name: "Matplotlib Tutorials", link: "https://matplotlib.org/stable/tutorials/index" },
            { name: "Seaborn Tutorial", link: "https://seaborn.pydata.org/tutorial.html" }
          ]
        },
        {
          title: "Machine Learning",
          description: "Learn the fundamentals of machine learning using scikit-learn.",
          resources: [
            { name: "Scikit-learn Tutorials", link: "https://scikit-learn.org/stable/tutorial/index.html" },
            { name: "Machine Learning Crash Course - Google", link: "https://developers.google.com/machine-learning/crash-course" }
          ]
        },
        {
          title: "Deep Learning",
          description: "Study neural networks with TensorFlow or PyTorch.",
          resources: [
            { name: "TensorFlow Tutorials", link: "https://www.tensorflow.org/tutorials" },
            { name: "PyTorch Tutorials", link: "https://pytorch.org/tutorials/" }
          ]
        },
        {
          title: "Projects & Specialization",
          description: "Work on real-world projects and specialize in an area (NLP, Computer Vision, etc.)",
          resources: [
            { name: "Kaggle Competitions", link: "https://www.kaggle.com/competitions" },
            { name: "DataCamp Projects", link: "https://learn.datacamp.com/projects" }
          ]
        }
      ]
    };
  } else {
    throw new Error("Career path not found. Try 'Software Engineer' or 'Data Scientist'.");
  }
};
