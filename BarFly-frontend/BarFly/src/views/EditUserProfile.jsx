import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Alert,
  Fab
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import useStore from "../stores/useStore";

import useForm from "../hooks/useForm";
import ImageUploader from "../components/common/ImageUploader";



const EditUserProfile = () => {
  // getting state from store
  const { editProfile, userObj, error, success } = useStore((state) => state);

  const [warning, setWarning] = useState();

  const { formState, handleChange } = useForm({
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    nickname: userObj.nickname,
    email: userObj.email,
    street: userObj.street,
    zip: userObj.zip,
    city: userObj.city,
    photo: null,
    birthDay: userObj.birthDay,
    birthMonth: userObj.birthMonth,
    birthYear: userObj.birthYear,
  });

  const navigate = useNavigate();


  const handleEdit = () => {

    const submitForm = new FormData();

    Object.entries(formState).forEach(([key, value]) => {
      submitForm.append(key, value);
    });

    console.log(submitForm);
    // funktion aus store
    editProfile(submitForm);
  };

  return (
    <>
      <Box
        sx={{
          m: "8rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AccountCircleIcon />
        </Avatar>

        <Typography variant="h4">Update account</Typography>

        {success && (
          <Alert severity="success" sx={{ minWidth: "100%" }}>
            {`Gratulation, ${userObj.nickname} wurde erfolgreich geändert!`}
          </Alert>
        )}

        {warning && (
          <Alert severity="warning" sx={{ minWidth: "100%" }}>
            {warning}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              label="Nickname"
              name="nickname"
              autoFocus
              value={formState.nickname}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              label="Email-Adresse"
              name="email"
              value={formState.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              label="Vorname"
              name="firstName"
              value={formState.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              label="Nachname"
              name="lastName"
              value={formState.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              required
              label="Tag"
              name="birthDay"
              value={formState.birthDay}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              required
              label="Monat"
              name="birthMonth"
              value={formState.birthMonth}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              required
              label="Jahr"
              name="birthYear"
              value={formState.birthYear}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              label="Adresse"
              name="street"
              value={formState.street}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              label="Postleitzahl"
              name="zip"
              value={formState.zip}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              label="Ort"
              name="city"
              value={formState.city}
              onChange={handleChange}
            />
          </Grid>

        </Grid>

        <Grid item xs={12}>
            <ImageUploader
              handleChange={handleChange}
              photo={formState.photo}
            />
          </Grid>

          {error && (
          <Alert severity="error" sx={{ minWidth: "100%" }}>
            {error.message}
          </Alert>
        )}

        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Fab
            color="primary"
            onClick={() => navigate('/user')}
            sx={{ mr: "4rem" }}
          >
            <ArrowBackIcon />
          </Fab>
          <Button onClick={handleEdit} variant="contained" sx={{ my: "2rem" }}>
            update profile
          </Button>
        </Box>
        
      </Box>
    </>
  );
};

export default EditUserProfile;
