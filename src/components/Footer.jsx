import React from 'react'

function Footer() {
  return (
    <div>
      {" "}
      <footer className="iq-footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <a href="../backend/privacy-policy.html">Privacy Policy</a>
                </li>
                <li className="list-inline-item">
                  <a href="../backend/terms-of-service.html">Terms of Use</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 text-right">
              <span className="mr-1">©</span>{" "}
              <a href="#" className>
                Webkit
              </a>
              .
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer