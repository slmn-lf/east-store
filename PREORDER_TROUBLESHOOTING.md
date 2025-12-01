# 🔧 Troubleshooting: Preorder Data Tidak Muncul di Admin

## 📋 Checklist

### 1. **Verifikasi API Endpoint**

```bash
# Test API endpoint
curl http://localhost:3000/api/preorder

# Expected response:
{
  "success": true,
  "data": [...],
  "count": 0
}
```

### 2. **Cek Browser Console**

1. Buka `/admin/preorder`
2. Buka Developer Tools (F12)
3. Periksa Console tab
4. Cari log yang dimulai dengan `[PREORDER PAGE]`
5. Verifikasi API response

### 3. **Cek Data di Database**

```bash
# Akses PostgreSQL
psql $DATABASE_URL

# Query preorders
SELECT * FROM preorders ORDER BY created_at DESC;

# Query dengan product details
SELECT p.*, pr.title as product_title
FROM preorders p
LEFT JOIN products pr ON p.product_id = pr.id
ORDER BY p.created_at DESC;
```

### 4. **Cek Network Request**

1. Buka `/admin/preorder`
2. Developer Tools → Network tab
3. Cari request ke `/api/preorder`
4. Periksa Response tab
5. Verifikasi data ada di response

---

## 🚨 Common Issues & Solutions

### Issue 1: "Tidak ada preorder yang ditemukan"

**Penyebab**: Database kosong atau preorder belum dibuat

**Solusi**:

```bash
# Step 1: Buat test preorder
1. Buka http://localhost:3000/products
2. Klik product apapun
3. Isi form preorder dan submit
4. Verifikasi WhatsApp message terkirim

# Step 2: Cek database
psql $DATABASE_URL
SELECT COUNT(*) FROM preorders;

# Step 3: Refresh admin page
http://localhost:3000/admin/preorder
```

### Issue 2: API Return Empty Array

**Penyebab**: Kesalahan di API query atau database connection

**Solusi**:

```bash
# Check API logs
npm run dev  # Lihat terminal logs

# Verify database connection
# Cek file .env.local - pastikan DATABASE_URL benar

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Jika error, update DATABASE_URL
# Format: postgresql://user:password@localhost:5432/eaststore
```

### Issue 3: Product Tidak Muncul (Hanya ID)

**Penyebab**: Product relationship tidak loaded dari database

**Solusi**:

```bash
# Verify di API response
curl http://localhost:3000/api/preorder | grep -i product

# Pastikan product.id di preorders sesuai dengan existing products
SELECT p.id, p.product_id, pr.title
FROM preorders p
LEFT JOIN products pr ON p.product_id = pr.id;

# Jika product_id null, update dengan valid product_id
UPDATE preorders SET product_id = 1 WHERE product_id IS NULL;
```

### Issue 4: Page Stuck on "Loading..."

**Penyebab**: Authentication error atau API error

**Solusi**:

```bash
# Check authentication
1. Verify login session - cek cookies di DevTools
2. Test /api/auth/check endpoint
curl http://localhost:3000/api/auth/check -b "cookie_here"

# If 401 Unauthorized:
- Logout dari /admin
- Login lagi ke /auth/login
- Retry di /admin/preorder
```

---

## 🛠️ Diagnostic Commands

### Run Diagnostic Script

```bash
# Automatic diagnosis
npm run diagnose:preorder

# Manual test
node scripts/diagnose-preorder.mjs
```

### Check Preorder Data

```bash
# Test API
node scripts/test-preorder-data.mjs

# Or use curl
curl -X GET http://localhost:3000/api/preorder \
  -H "Content-Type: application/json"
```

### Database Verification

```bash
# Connect to database
psql $DATABASE_URL

# List all preorders with full details
SELECT
  p.id,
  p.customer_name,
  p.customer_phone,
  p.status,
  p.size,
  p.quantity,
  p.total_price,
  pr.title as product_title,
  p.created_at
FROM preorders p
LEFT JOIN products pr ON p.product_id = pr.id
ORDER BY p.created_at DESC
LIMIT 10;
```

---

## 📊 Expected Data Structure

### API Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_name": "John Doe",
      "customer_phone": "+6281234567890",
      "customer_address": "Jl. Merdeka No. 123",
      "product_id": 1,
      "size": "M",
      "quantity": 2,
      "total_price": 370000,
      "status": "pending",
      "created_at": "2025-12-01T10:30:00.000Z",
      "updated_at": "2025-12-01T10:30:00.000Z",
      "product": {
        "id": 1,
        "title": "Abstract Minds Tee",
        "slug": "abstract-minds-tee",
        "price_idr": 185000
      }
    }
  ],
  "count": 1
}
```

---

## ✅ Verification Checklist

- [ ] API endpoint `/api/preorder` returns 200 status
- [ ] Response contains `data` array
- [ ] Database has preorder records
- [ ] Product relationship is loaded
- [ ] Admin page shows "Menampilkan X preorder"
- [ ] Filter dan search berfungsi
- [ ] Status dapat diubah
- [ ] Preorder dapat dihapus

---

## 🔄 Step-by-Step Fix

1. **Restart Development Server**

   ```bash
   # Kill current server (Ctrl+C)
   npm run dev
   ```

2. **Clear Build Cache**

   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Force Refresh Browser**

   ```
   Ctrl+F5 (Windows)
   Cmd+Shift+R (Mac)
   ```

4. **Check Database**

   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM preorders;"
   ```

5. **Test API Directly**

   ```bash
   curl http://localhost:3000/api/preorder
   ```

6. **Check Browser Console**
   - Open DevTools
   - Check for errors
   - Look for `[PREORDER PAGE]` logs

---

## 📞 If Still Having Issues

### Debug Information to Collect

1. Error message dari console
2. API response status code
3. Database query hasil
4. Network request/response (dari DevTools)
5. Browser dan OS information

### Report Format

```
Error: [error message]
Location: /admin/preorder
API Status: [status code]
Browser: [name and version]
Database: [connected/error]
```

---

**Last Updated**: 1 Desember 2025
