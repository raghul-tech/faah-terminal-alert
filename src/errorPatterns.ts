export const errorPatterns = new RegExp(
    '\\b(' +
    // General errors
    'error|errors?\\b|failed?|fail\\b|fatal|exception|traceback|stack\\s*trace|' +
    
    // Command/Execution errors
    'not\\s+recognized|command\\s+not\\s+found|permission\\s+denied|access\\s+denied|' +
    'cannot\\s+find|unable\\s+to|could\\s+not|no\\s+such\\s+file|directory\\s+not\\s+found|' +
    'is\\s+not\\s+recognized|is\\s+not\\s+defined|is\\s+not\\s+a\\s+function|' +
    
    // JavaScript/Node.js
    'uncaught\\s+exception|unhandled\\s+rejection|referenceerror|typeerror|syntaxerror|' +
    'rangeerror|urierror|evalerror|cannot\\s+read\\s+property|cannot\\s+set\\s+property|' +
    'undefined\\s+is\\s+not\\s+a\\s+function|module\\s+not\\s+found|cannot\\s+find\\s+module|' +
    'npm\\s+err!|node-gyp\\s+err|' +
    
    // Python
    'traceback\\s+\\(most\\s+recent\\s+call\\s+last\\)|file\\s+"[^"]+",\\s+line\\s+\\d+|' +
    'nameerror|valueerror|keyerror|indexerror|attributeerror|importerror|modulenotfounderror|' +
    'typeerror|syntaxerror|indentationerror|zerodivisionerror|filenotfounderror|' +
    'runtimeerror|notimplementederror|assertionerror|memoryerror|' +
    'python\\s+error|pip\\s+error|' +
    
    // Java
    'exception\\s+in\\s+thread|java\\.lang\\.|nullpointerexception|classcastexception|' +
    'arrayindexoutofboundsexception|illegalargumentexception|ioexception|filenotfoundexception|' +
    'sqlException|classnotfoundexception|nosuchmethodexception|nosuchfieldexception|' +
    'concurrentmodificationexception|stackoverflowerror|outofmemoryerror|' +
    'maven\\s+error|gradle\\s+error|' +
    
    // C/C++
    'segmentation\\s+fault|core\\s+dumped|undefined\\s+reference|' +
    'compilation\\s+terminated|collect2:\\s+error|ld:\\s+returned|' +
    'cannot\\s+find\\s+-l|gcc:\\s+error|g\\+\\+:\\s+error|make:\\s+\\*\\*\\*|' +
    'cmake\\s+error|' +
    
    // C#
    'cs\\d{4}|unhandled\\s+exception|object\\s+reference\\s+not\\s+set|' +
    'nullreferenceexception|argumentexception|invalidoperationexception|' +
    'notsupportedexception|unauthorizedaccessexception|' +
    'msbuild\\s+error|dotnet\\s+error|' +
    
    // PHP
    'parse\\s+error|syntax\\s+error|fatal\\s+error|warning:\\s|notice:\\s|' +
    'undefined\\s+variable|undefined\\s+index|call\\s+to\\s+undefined\\s+function|' +
    'cannot\\s+redeclare|composer\\s+error|' +
    
    // Ruby
    'syntaxerror|nameerror|argumenterror|typeerror|zerodivisionerror|' +
    'loaderror|notimplementederror|runtimeerror|securityerror|' +
    'gem\\s+error|bundle\\s+error|' +
    
    // Go
    'go:\\s+error|cannot\\s+find\\s+package|undefined:\\s|' +
    'import\\s+cycle|multiple-value\\s+in\\s+single-value\\s+context|' +
    'panic:\\s|goroutine\\s+\\d+\\s+\\[running\\]:|' +
    
    // Rust
    'error\\[e\\d{4}\\]:|error:\\s+aborting\\s+due\\s+to\\s+previous\\s+error|' +
    'could\\s+not\\s+compile|rustc:\\s+error|' +
    
    // Swift
    'error:\\s+|fatal\\s+error:|swift\\s+compiler\\s+error|' +
    'cannot\\s+convert\\s+value|cannot\\s+assign\\s+value|' +
    
    // Kotlin
    'kotlin\\.\\w+Exception|unresolved\\s+reference|' +
    'type\\s+mismatch|smart\\s+cast\\s+to\\s+is\\s+impossible|' +
    
    // TypeScript
    'ts\\d{4}|typescript\\s+error|cannot\\s+find\\s+name|cannot\\s+find\\s+module|' +
    'property\\s+does\\s+not\\s+exist|type\\s+is\\s+not\\s+assignable|' +
    
    // Docker
    'docker:\\s+error|cannot\\s+connect\\s+to\\s+the\\s+docker\\s+daemon|' +
    'no\\s+such\\s+image|container\\s+is\\s+not\\s+running|' +
    
    // Git
    'fatal:\\s|git\\s+error|merge\\s+conflict|rebase\\s+conflict|' +
    'not\\s+a\\s+git\\s+repository|uncommitted\\s+changes|' +
    
    // Database
    'sql\\s+error|database\\s+error|connection\\s+refused|' +
    'duplicate\\s+entry|foreign\\s+key\\s+constraint\\s+fails|' +
    'deadlock\\s+detected|query\\s+failed|' +
    
    // Network/HTTP
    'network\\s+error|connection\\s+refused|timeout\\s+error|' +
    'http\\s+\\d{3}|404\\s+not\\s+found|500\\s+internal\\s+server\\s+error|' +
    'could\\s+not\\s+resolve\\s+host|ssl\\s+error|certificate\\s+error|' +
    
    // Package Managers
    'npm\\s+err!|yarn\\s+error|pip\\s+error|conda\\s+error|' +
    'gem\\s+error|composer\\s+error|cargo\\s+error|' +
    'nuget\\s+error|chocolatey\\s+error|brew\\s+error|' +
    
    // Build Tools
    'build\\s+failed|compilation\\s+failed|test\\s+failed|' +
    'webpack:\\s+error|vite:\\s+error|rollup:\\s+error|' +
    'babel:\\s+error|eslint:\\s+error|prettier:\\s+error|' +
    
    // Kubernetes
    'error\\s+from\\s+server|connection\\s+refused|' +
    'unauthorized|forbidden|resource\\s+not\\s+found|' +
    
    // General warnings/errors
    'warning:\\s|deprecated|aborting|stopped|terminated|' +
    'invalid\\s+syntax|illegal\\s+character|unexpected\\s+token|' +
    'missing\\s+\\w+|expected\\s+\\w+|got\\s+\\w+|' +
    
    // Exit codes
    'exit\\s+code\\s+[1-9]\\d*|process\\s+finished\\s+with\\s+exit\\s+code\\s+[1-9]' +
    ')\\b',
    'i'  // Case insensitive
);