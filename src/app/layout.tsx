'use client';

import React from 'react';
import LeafletFixScript from '@/components/maps/LeafletFixScript';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Geospatial Public Health Insights</title>
        <meta name="description" content="Interactive geospatial health data visualization for Abu Dhabi" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
      </head>
      <body>
        <LeafletFixScript />
        {children}
      </body>
    </html>
  );
}
