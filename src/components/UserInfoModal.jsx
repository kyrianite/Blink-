/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserInfoModal({ setUsername, setEmail }) {
  const [show, setShow] = useState(true);
  const [username, setNewUsername] = useState('');
  const [email, setNewEmail] = useState('');
  const [error, setError] = useState({});

  const updateUsername = (e) => {
    setNewUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setNewEmail(e.target.value);
  };

  const isValidEmail = () => email === '' || (email.includes('@') && email.length > 2);

  const closeModal = () => {
    if (email === '') {
      setUsername('Anonymous');
      setEmail('none');
    } else {
      setUsername(username);
      setEmail(email);
    }
    setShow(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValidEmail()) {
      setError({ ...error, email: null });
      closeModal();
    } else {
      setError({ ...error, email: 'Please input a valid email or leave empty' });
    }
  };
  // const handleShow = () => setShow(true);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}
      <Modal show={show} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Blink!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Submit a username and email, or leave both blank.
          <Form>
            <Form.Group className="user-info" controlId="form.ControlInput1">
              <Form.Label>Username:</Form.Label>
              <Form.Control name="username" type="text" placeholder="Anonymous" onChange={updateUsername} autoFocus />
              <Form.Label>Email address:</Form.Label>
              <Form.Control name="email" type="email" placeholder="name@domain.com" onChange={updateEmail} isInvalid={!!error.email} />
              <Form.Control.Feedback type="invalid">{error.email}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
