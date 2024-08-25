import os
import subprocess
from datetime import datetime

def get_backup_directory():
    # Determine the directory for the backup files
    script_directory = os.path.dirname(os.path.abspath(__file__))
    app_directory = os.path.dirname(script_directory)
    backup_directory = os.path.join(app_directory, 'backups')

    # Create the backup directory if it doesn't exist
    os.makedirs(backup_directory, exist_ok=True)
    return backup_directory

def backup_database(host, port, database, user, password):
    # Generate a timestamp for the backup file
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Determine the directory and file path for the backup
    backup_directory = get_backup_directory()
    backup_file = os.path.join(backup_directory, f'backup_{timestamp}.sql')

    # Path to the pg_dump executable
    pg_dump_path = 'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe'  # Update this path as necessary

    # Construct the pg_dump command
    pg_dump_command = [
        pg_dump_path,
        '-h', host,
        '-p', port,
        '-U', user,
        '-d', database,
        '-Fc',  # Custom format to include data
        '-f', backup_file
    ]

    # Environment variable for the password
    env = os.environ.copy()
    env['PGPASSWORD'] = password

    try:
        # Execute the pg_dump command
        subprocess.run(pg_dump_command, check=True, env=env)
        return backup_file

    except subprocess.CalledProcessError as error:
        # Raise an error if the backup fails
        raise RuntimeError(f"Error while backing up PostgreSQL database: {error}")