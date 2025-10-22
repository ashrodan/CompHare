# Admin Dashboard Guide - CompHare

Complete guide to using the CompHare admin dashboard for managing gas and olive oil providers.

## Quick Start

### 1. Access the Admin Dashboard

Navigate to: `http://localhost:4321/admin/login` (or your production URL)

**Default Credentials:**
- Username: `admin`
- Password: `comphare2024`

**IMPORTANT:** Change these credentials in production! Update the `.env` file:
```env
ADMIN_USERNAME="your-secure-username"
ADMIN_PASSWORD="your-secure-password"
SESSION_SECRET="your-random-secret-key"
```

### 2. Dashboard Overview

After logging in, you'll see the main dashboard with:
- **Statistics Cards**: Quick overview of provider counts
- **Quick Actions**: Common tasks like adding providers
- **Navigation**: Access gas providers, olive oil management

## Managing Gas Providers

### View All Gas Providers

**Path:** `/admin/gas-providers`

Lists all gas providers with their summer and non-summer rates. Each provider shows:
- Daily charges
- 5-tier pricing structure (0-100 MJ, 100-200 MJ, etc.)
- Edit and delete options

### Add New Gas Provider

**Path:** `/admin/gas-providers/new`

**Required Fields:**
1. **Provider Name**: e.g., "Tango Energy", "Momentum Energy"

2. **Summer Rates:**
   - Season label (e.g., "Summer (Nov-Apr)")
   - Daily charge in cents (e.g., 115.500)
   - 5 tier rates in cents/MJ:
     - Step 1: 0-100 MJ
     - Step 2: 100-200 MJ
     - Step 3: 200-300 MJ
     - Step 4: 300-400 MJ
     - Step 5: 400+ MJ

3. **Non-Summer Rates:**
   - Same structure as summer rates
   - Different season label (e.g., "Non-Summer (May-Oct)")

**Example Values (Tango Energy):**
```
Provider Name: Tango
Summer Season: Summer (Nov-Apr)
Summer Daily Charge: 115.500
Summer Rates: 3.179, 2.816, 2.596, 2.453, 2.321

Non-Summer Season: Non-Summer (May-Oct)
Non-Summer Daily Charge: 115.500
Non-Summer Rates: 3.443, 3.234, 3.003, 2.772, 2.596
```

### Edit Gas Provider

**Path:** `/admin/gas-providers/edit/[id]`

Updates an existing provider. All fields are pre-populated. Make changes and click "Update Provider".

### Delete Gas Provider

Click the red trash icon on any provider card. Confirm the deletion. **This action cannot be undone.**

## Managing Olive Oil Providers

### View All Providers

**Path:** `/admin/olive-oil`

Displays all olive oil providers with:
- Name and description
- Location and stock status
- Shipping costs
- All volume options with prices

### Add New Olive Oil Provider

**Path:** `/admin/olive-oil/new`

**Required Fields:**
1. **Provider Information:**
   - Provider Name (e.g., "Cobram Estate Extra Virgin Olive Oil")
   - Location (e.g., "Victoria", "New South Wales")
   - Shipping Cost in dollars (e.g., 9.95)
   - Stock Status (In Stock, Low Stock, Out of Stock)
   - Product Link (URL to their website)
   - Description (brief text about the producer)

2. **Volume Options:** (at least one required)
   - Volume in liters (e.g., 0.5, 1.0, 2.0)
   - Price in dollars (e.g., 14.99, 24.99)
   - Click "+ Add Option" for multiple sizes

**Example (Cobram Estate):**
```
Name: Cobram Estate Extra Virgin Olive Oil
Location: Victoria
Shipping: $9.95
Stock Status: In Stock
Link: https://cobramestate.com.au/shop/extra-virgin-olive-oil
Description: Family-owned estate producing award-winning olive oils since 1996.

Volume Options:
- 0.5L: $14.99
- 1.0L: $24.99
- 2.0L: $44.99
```

### Edit Olive Oil Provider

**Path:** `/admin/olive-oil/edit/[id]`

Updates provider details. You can:
- Modify basic information
- Add/remove volume options dynamically
- Click the X button to remove volume options
- Click "+ Add Option" for new sizes

### Delete Olive Oil Provider

Click the red trash icon. Confirm deletion. This removes the provider and all associated volume options.

## Admin Dashboard Features

### Authentication

**Session Duration:** 24 hours

**Logout:** Click "Logout" in the navigation or visit `/admin/logout`

**Security Notes:**
- Sessions use HTTP-only cookies
- Passwords should be changed from defaults
- All admin routes require authentication
- Unauthorized access redirects to login page

### API Endpoints

All admin operations use REST API endpoints:

**Gas Providers:**
- `GET /api/admin/gas-providers` - List all
- `POST /api/admin/gas-providers` - Create new
- `GET /api/admin/gas-providers/[id]` - Get one
- `PUT /api/admin/gas-providers/[id]` - Update
- `DELETE /api/admin/gas-providers/[id]` - Delete

**Olive Oil Providers:**
- `GET /api/admin/olive-oil` - List all
- `POST /api/admin/olive-oil` - Create new
- `GET /api/admin/olive-oil/[id]` - Get one
- `PUT /api/admin/olive-oil/[id]` - Update
- `DELETE /api/admin/olive-oil/[id]` - Delete

### Error Handling

**Common Errors:**

1. **"Unauthorized"** - Session expired, log in again
2. **"Missing required fields"** - Fill in all required form fields
3. **"Failed to create/update provider"** - Check database connection
4. **"Provider not found"** - Provider may have been deleted

## Best Practices

### Data Entry Tips

1. **Gas Provider Rates:**
   - Verify rates from official provider websites
   - Double-check decimal places (cents, not dollars)
   - Keep season labels consistent
   - Rates typically decrease across tiers

2. **Olive Oil Providers:**
   - Use full producer names
   - Include direct product links when possible
   - Add multiple volume options for better comparisons
   - Keep descriptions concise but informative
   - Update stock status regularly

### Workflow Recommendations

1. **Before Adding:**
   - Gather all rate information
   - Verify current pricing
   - Check for existing duplicates

2. **After Adding:**
   - View the public comparison pages
   - Verify data displays correctly
   - Test calculations (for gas rates)

3. **Regular Maintenance:**
   - Review rates quarterly
   - Update stock statuses
   - Remove discontinued providers
   - Add new competitors as they appear

## Troubleshooting

### Can't Log In

- Check credentials in `.env` file
- Ensure `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Clear browser cookies and try again

### Form Won't Submit

- Check all required fields (marked with *)
- Ensure numeric values are valid
- Check browser console for JavaScript errors
- Verify database connection

### Data Not Appearing on Public Pages

- Refresh the public pages
- Check database has data (`npm run db:studio`)
- Verify API routes are working
- Check server logs for errors

### Volume Options Not Saving

- Ensure at least one volume option is provided
- Both volume and price must be filled
- Click "+ Add Option" before typing
- Remove empty rows before submitting

## Production Deployment

### Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong, unique SESSION_SECRET
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags
- [ ] Consider adding rate limiting
- [ ] Implement CSRF protection
- [ ] Add IP whitelist if needed
- [ ] Regular password rotation

### Recommended Enhancements

For production use, consider:

1. **Better Authentication:**
   - Use Auth.js, Clerk, or Supabase Auth
   - Implement 2FA
   - Add password reset functionality
   - Role-based access control

2. **Audit Logging:**
   - Track all create/update/delete operations
   - Log admin user actions
   - Maintain change history

3. **Validation:**
   - Server-side form validation
   - Rate limit API endpoints
   - Sanitize user inputs

4. **UI Enhancements:**
   - Bulk import from CSV
   - Export data functionality
   - Advanced filtering/search
   - Pagination for large datasets

## Support

### Getting Help

If you encounter issues:

1. Check the [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database issues
2. Review server console logs
3. Test API endpoints with curl or Postman
4. Verify environment variables are set correctly

### File Locations

**Admin Pages:**
- `/src/pages/admin/` - Dashboard pages
- `/src/pages/api/admin/` - API endpoints
- `/src/layouts/AdminLayout.astro` - Admin layout
- `/src/utils/auth.ts` - Authentication logic
- `/src/components/OliveOilForm.tsx` - Form component

**Authentication:**
- Login: `/src/pages/admin/login.astro`
- Logout: `/src/pages/admin/logout.astro`

---

**Admin Dashboard Version:** 1.0
**Last Updated:** 2025-10-22

For more information, see the main [DATABASE_SETUP.md](./DATABASE_SETUP.md) guide.
