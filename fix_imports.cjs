const fs = require('fs');
const path = require('path');
function r(d) {
    fs.readdirSync(d).forEach(f => {
        if (f.endsWith('.js')) {
            const fp = path.join(d, f);
            let c = fs.readFileSync(fp, 'utf8');
            c = c.replace(/from\s+['"](?:\.\.\/|\.\/)(?:user\/)?BaseService['"]/g, "from '../BaseService'");
            fs.writeFileSync(fp, c);
        }
    });
}
r('src/services/user');
r('src/services/admin');
