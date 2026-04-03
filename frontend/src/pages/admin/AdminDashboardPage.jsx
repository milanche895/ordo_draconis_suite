import { useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { Box, Container, Typography, Button, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import NewsAdmin from "./NewsAdmin";
import ProductsAdmin from "./ProductsAdmin";
import AlbumsAdmin from "./AlbumsAdmin";
import MediaAdmin from "./MediaAdmin";
import WorkshopsAdmin from "./WorkshopsAdmin";
import MuseumItemsAdmin from "./MuseumItemsAdmin";
import FestivalsAdmin from "./FestivalsAdmin";
import KrcmaAdmin from "./KrcmaAdmin";

const ADMIN_TAB_PATHS = [
  "/admin/festivals",
  "/admin/museum",
  "/admin/workshops",
  "/admin/krcma",
  "/admin/albums",
  "/admin/news",
  "/admin/products",
  "/admin/media",
];

function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const path = location.pathname;
    const idx = ADMIN_TAB_PATHS.findIndex((p) => path.startsWith(p));
    if (idx >= 0) {
      setTab(idx);
    } else if (path === "/admin" || path === "/admin/") {
      setTab(5);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/admin/login");
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4">Админ панел</Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Одјава
          </Button>
        </Box>

        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ mb: 4 }}
        >
          <Tab
            label="Штит фестивал"
            onClick={() => navigate("/admin/festivals")}
          />
          <Tab label="Музеј" onClick={() => navigate("/admin/museum")} />
          <Tab label="Радионице" onClick={() => navigate("/admin/workshops")} />
          <Tab label="Крчма" onClick={() => navigate("/admin/krcma")} />
          <Tab label="Албуми" onClick={() => navigate("/admin/albums")} />
          <Tab label="Вести" onClick={() => navigate("/admin/news")} />
          <Tab label="Производи" onClick={() => navigate("/admin/products")} />
          <Tab label="Медија" onClick={() => navigate("/admin/media")} />
        </Tabs>

        <Routes>
          <Route path="news/*" element={<NewsAdmin />} />
          <Route path="products/*" element={<ProductsAdmin />} />
          <Route path="albums/*" element={<AlbumsAdmin />} />
          <Route path="workshops/*" element={<WorkshopsAdmin />} />
          <Route path="krcma/*" element={<KrcmaAdmin />} />
          <Route path="museum/*" element={<MuseumItemsAdmin />} />
          <Route path="festivals/*" element={<FestivalsAdmin />} />
          <Route path="media/*" element={<MediaAdmin />} />
          <Route path="*" element={<NewsAdmin />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default AdminDashboardPage;
