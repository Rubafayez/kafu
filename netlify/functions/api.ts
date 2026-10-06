import serverless from 'serverless-http';
import { app } from '../../api-app';

// كل طلبات /api/* على Netlify تمر من هنا إلى نفس تطبيق Express المستخدم محلياً.
// لو وصل المسار بصيغة الدالة الداخلية نرجّعه لصيغة /api التي يعرفها التطبيق.
const FUNCTION_PREFIX = '/.netlify/functions/api';

export const handler = serverless(app, {
  request(req: { url: string }) {
    if (req.url.startsWith(FUNCTION_PREFIX)) {
      req.url = '/api' + req.url.slice(FUNCTION_PREFIX.length);
    }
  },
});
