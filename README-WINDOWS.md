# Windows Setup Guide

## Local Domain Configuration

To run this project on Windows, you need to configure local domains in your hosts file.

### 1. Open the hosts file as Administrator

The Windows hosts file is located at:

```
C:\Windows\System32\drivers\etc\hosts
```

**To edit it:**

1. Open **Notepad** as Administrator (right-click → "Run as administrator")
2. Go to File → Open
3. Navigate to `C:\Windows\System32\drivers\etc\`
4. Change the file type dropdown from "Text Documents (_.txt)" to "All Files (_.\*)"
5. Open the `hosts` file

### 2. Add these entries

Add the following lines to the end of the file:

```
127.0.0.1 celeste.local
127.0.0.1 helen.local
127.0.0.1 madkin.local
```

### 3. Save and flush DNS cache

1. Save the file (Ctrl+S)
2. Open **Command Prompt** as Administrator
3. Run: `ipconfig /flushdns`

### 4. Test the setup

After starting the dev server with `pnpm run dev`, you should be able to access:

- http://celeste.local:4370
- http://helen.local:4370
- http://madkin.local:4370

Each domain maps to a different property in the multi-tenant nursery app.

## Troubleshooting

- **Can't save the hosts file?** Make sure you opened Notepad as Administrator
- **Domains not resolving?** Try flushing DNS cache again with `ipconfig /flushdns`
- **Still not working?** Verify the entries are exactly as shown above with no extra spaces
