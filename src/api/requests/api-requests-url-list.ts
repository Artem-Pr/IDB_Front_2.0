export const enum RequestUrl {
    // auth
    LOGIN = '/auth/login',
    LOGOUT = '/auth/logout',
    REFRESH_TOKENS = '/auth/refresh',
    GET_PERMISSIONS = '/auth/permissions',

    // files
    SAVE_FILES = '/save-files',
    UPDATE_FILES = '/update-files',
    CHECK_DUPLICATES = '/check-duplicates',
    FILTERED_PHOTOS = '/filtered-photos',
    DELETE_FILE = '/delete-files',
    FILES_DESCRIPTION = '/files/description',

    // temporary files
    UPLOAD_FILE = '/upload-file',
    CLEAN_TEMP = '/clean-temp',

    // keywords
    KEYWORD = '/keyword',
    KEYWORDS = '/keywords',
    UNUSED_KEYWORDS = '/unused-keywords',

    // paths
    PATHS = '/paths',
    DIRECTORY = '/directory',
    CHECK_DIRECTORY = '/check-directory',

    // test
    MATCHING_FILES = '/test-system/matching-files',
    REBUILD_PATHS_CONFIG = '/rebuild-paths-config',

    // tus
    TUS_UPLOAD = '/tus/upload',
}
