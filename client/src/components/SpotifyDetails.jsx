import React from "react";
import Slider from "react-slick";
import { Box, Typography, Chip, Stack } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SpotifyDetails = ({ spotifyData }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Spotify Details
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1" component="strong" gutterBottom>
          Genres:
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="flex-start"
        >
          {spotifyData.genres.map((genre, index) => (
            <Chip
              key={index}
              label={genre}
              variant="outlined"
              sx={{ marginBottom: 1, marginRight: 1 }} // Ensure proper spacing around each Chip
            />
          ))}
        </Stack>
      </Box>

      {spotifyData.artists && (
        <Box>
          <Typography variant="subtitle1" component="h4" gutterBottom>
            Artists
          </Typography>
          <Slider {...settings}>
            {spotifyData.artists.map((artist, index) => (
              <Box key={index} sx={{ padding: 1, textAlign: "center" }}>
                <img
                  src={artist.albumImageUrl}
                  alt={artist.name}
                  // Fixed size for all images and auto margins for centering
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    margin: "auto",
                  }}
                />
                <Typography variant="body2" noWrap>
                  {artist.name}
                </Typography>
              </Box>
            ))}
          </Slider>
        </Box>
      )}

      {/* Similarly for tracks if available */}
    </Box>
  );
};

export default SpotifyDetails;
