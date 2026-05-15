<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  exclude-result-prefixes="sm news image">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="es">
<head>
  <title>News Sitemap — Acontecer.co.cr</title>
  <meta charset="UTF-8"/>
  <meta name="robots" content="noindex"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Inter,system-ui,sans-serif;background:#f4f6fb;color:#222}
    header{background:linear-gradient(135deg,#0000A2,#0a73ce);color:white;padding:28px 32px}
    header h1{font-size:22px;font-weight:700}
    header p{font-size:13px;opacity:.8;margin-top:6px}
    .container{max-width:1100px;margin:28px auto;padding:0 20px}
    .stats{display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap}
    .stat{background:white;border-radius:10px;padding:16px 24px;box-shadow:0 1px 6px rgba(0,0,0,.07);flex:1;min-width:140px}
    .stat strong{display:block;font-size:28px;color:#0000A2;font-weight:700}
    .stat span{font-size:12px;color:#888;margin-top:2px;display:block}
    table{width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,.07)}
    thead{background:#0000A2;color:white}
    th{padding:12px 16px;text-align:left;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
    td{padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;vertical-align:top}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:#f8f9ff}
    .url a{color:#0a73ce;text-decoration:none;word-break:break-all}
    .url a:hover{text-decoration:underline}
    .date{color:#888;white-space:nowrap}
    .thumb{width:72px;height:48px;object-fit:cover;border-radius:4px}
    .no-img{width:72px;height:48px;background:#eee;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:18px}
  </style>
</head>
<body>
<header>
  <h1>📰 News Sitemap — Acontecer.co.cr</h1>
  <p>Noticias de las últimas 48 horas indexadas para Google News</p>
</header>
<div class="container">
  <div class="stats">
    <div class="stat">
      <strong><xsl:value-of select="count(sm:urlset/sm:url)"/></strong>
      <span>Noticias activas</span>
    </div>
    <div class="stat">
      <strong><xsl:value-of select="count(sm:urlset/sm:url[image:image])"/></strong>
      <span>Con imagen</span>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Imagen</th>
        <th>Titular</th>
        <th>URL</th>
        <th>Publicación</th>
      </tr>
    </thead>
    <tbody>
      <xsl:for-each select="sm:urlset/sm:url">
        <xsl:sort select="news:news/news:publication_date" order="descending"/>
        <tr>
          <td>
            <xsl:choose>
              <xsl:when test="image:image/image:loc">
                <img class="thumb" src="{image:image/image:loc}" alt="{image:image/image:caption}" loading="lazy"/>
              </xsl:when>
              <xsl:otherwise>
                <div class="no-img">📷</div>
              </xsl:otherwise>
            </xsl:choose>
          </td>
          <td><strong><xsl:value-of select="news:news/news:title"/></strong></td>
          <td class="url">
            <a href="{sm:loc}" target="_blank" rel="noopener">
              <xsl:value-of select="sm:loc"/>
            </a>
          </td>
          <td class="date">
            <xsl:value-of select="substring(news:news/news:publication_date,1,10)"/>
            <br/>
            <span style="font-size:11px;color:#aaa">
              <xsl:value-of select="substring(news:news/news:publication_date,12,5)"/>
            </span>
          </td>
        </tr>
      </xsl:for-each>
    </tbody>
  </table>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
