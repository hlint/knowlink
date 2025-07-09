---
outline: deep
---

# Data Security

This document introduces Knowlink's data security measures and best practices to help users protect their personal data security.

## Data Backup and Recovery

### Complete Runtime Backup

- Regularly backup the `runtime/` directory (containing database, images, files, and configuration)
- Consider using cloud storage services for off-site backup

### In-app Data Backup

Knowlink provides built-in data export functionality:

1. Go to **Settings** → **Data Management**
2. Select **Export Data**
3. Download the data file

### Data Backup Recommendations

- Regular off-site backup
- Complete runtime backup before version upgrades

## HTTPS Configuration

### Strongly Recommend Enabling HTTPS

To protect data transmission security, it's strongly recommended to enable HTTPS in production environments. This can:

- Encrypt communication between client and server
- Prevent data from being eavesdropped during transmission
- Provide authentication to ensure connection to the correct server
- Meet modern browser security requirements

### Recommended to Use Nginx Proxy Manager

[Nginx Proxy Manager](https://nginxproxymanager.com/) is an open-source Nginx proxy management tool that provides:

- **Graphical Interface**: No need to manually edit configuration files
- **Automatic SSL Certificates**: Built-in Let's Encrypt support with auto-renewal
- **Security Configuration**: Pre-configured security headers and best practices
- **Multi-user Support**: Can configure multiple users to manage different proxy hosts
- **Docker Deployment**: Simple one-click deployment

### Basic Configuration Steps

1. **Deploy Nginx Proxy Manager**

   - Quick deployment using Docker
   - Configure database (MySQL/MariaDB)

2. **Add Proxy Host**

   - Domain: `your-domain.com`
   - Target: `http://localhost:3000`
   - Enable SSL: Choose Let's Encrypt

3. **Configure Security Options**
   - Enable HSTS
   - Configure security headers
   - Set access control (if needed)

### Other Proxy Tools

Besides Nginx Proxy Manager, you can also consider:

- **Traefik**: Modern reverse proxy and load balancer
- **Caddy**: Web server with automatic HTTPS

## Good Usage Habits

### Password Security

- **Length**: At least 12 characters
- **Complexity**: Include uppercase and lowercase letters, numbers, special characters
- **Uniqueness**: Use different passwords for different services
- **Regular Changes**: Change every 3-6 months

### Note Visibility Settings

The following notes are recommended to set visibility as private:

- Personal diaries
- Financial information
- Password records
- Sensitive projects
- Any other notes you feel shouldn't be accessed by external AI
