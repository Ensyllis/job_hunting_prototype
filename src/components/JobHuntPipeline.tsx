import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/JobHuntPipeline.module.css';

interface Company {
  _id: string;
  FirmName: string;
  AUM?: string;
  Link?: string;
  Status?: string;
  WebsiteText?: string;  // Added WebsiteText field
  error_message?: string;
  People?: {
    [email: string]: {
      first_name?: string;
      last_name?: string;
      position?: string;
      seniority?: string;
      department?: string;
      linkedin?: string;
      confidence?: number;
    };
  };
}

const JobHuntPipeline: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [expandedText, setExpandedText] = useState<string | null>(null);

  useEffect(() => {
    // Fetch companies from the backend
    axios.get('/api/companies')
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
      });
  }, []);

  const filteredCompanies = searchQuery
    ? companies.filter(company => company.FirmName.toLowerCase().includes(searchQuery.toLowerCase()))
    : companies;

  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.toggleSwitch}>
        <label className={styles.switchLabel}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className={styles.slider}></span>
        </label>
        <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </div>

      <h1 className={styles.title}>Job Hunt Pipeline Data</h1>
      
      <input
        type="text"
        className={styles.searchBar}
        placeholder="Search Company Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>AUM</th>
              <th>Link</th>
              <th>Status</th>
              <th>Website Content</th>
              <th>People</th>
              <th>Email Draft</th>
              <th>Email Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company._id}>
                <td>{company.FirmName}</td>
                <td>{company.AUM || 'N/A'}</td>
                <td>
                  {company.Link ? (
                    <a href={company.Link} target="_blank" rel="noopener noreferrer">
                      {company.Link}
                    </a>
                  ) : 'N/A'}
                </td>
                <td>{company.Status || 'N/A'}</td>
                <td className={styles.websiteTextCell}>
                  {company.WebsiteText ? (
                    <div className={styles.websiteTextContainer}>
                      <div className={styles.websiteTextContent}>
                        {expandedText === company._id ? (
                          <>
                            <p>{company.WebsiteText}</p>
                            <button 
                              onClick={() => setExpandedText(null)}
                              className={styles.toggleButton}
                            >
                              Show Less
                            </button>
                          </>
                        ) : (
                          <>
                            <p>{truncateText(company.WebsiteText)}</p>
                            <button 
                              onClick={() => setExpandedText(company._id)}
                              className={styles.toggleButton}
                            >
                              Show More
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : 'No content available'}
                </td>
                <td>
                  {company.People ? (
                    <ul>
                      {Object.entries(company.People).map(([email, info]) => (
                        <li key={email}>
                          <strong>Email:</strong> {email} <br />
                          <strong>Name:</strong> {info.first_name} {info.last_name} <br />
                          <strong>Position:</strong> {info.position || 'N/A'} <br />
                          <strong>Seniority:</strong> {info.seniority || 'N/A'} <br />
                          <strong>Department:</strong> {info.department || 'N/A'} <br />
                          <strong>LinkedIn:</strong> {info.linkedin ? (
                            <a href={info.linkedin} target="_blank" rel="noopener noreferrer">Profile</a>
                          ) : 'Not available'} <br />
                          <strong>Confidence Level:</strong> {info.confidence || 'N/A'}
                          <hr className="separator" />
                        </li>
                      ))}
                    </ul>
                  ) : 'No contacts available'}
                </td>
                <td>
                  <textarea
                    className={styles.emailDraft}
                    placeholder="Write your email draft here..."
                  />
                </td>
                <td>
                  <button className={styles.emailButton} disabled>
                    Send Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobHuntPipeline;