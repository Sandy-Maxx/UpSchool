// Permission Matrix UI component (minimal)
import React from 'react'

const permissions = [
  { resource: 'users', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'students', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'reports', actions: ['view', 'export'] },
]

const roles = ['superadmin', 'admin', 'teacher', 'student', 'parent', 'staff']

const PermissionMatrix: React.FC = () => {
  return (
    <div>
      <h2>Permission Matrix</h2>
      <table role="table">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Action</th>
            {roles.map((r) => (
              <th key={r}>{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((p) => (
            p.actions.map((a) => (
              <tr key={`${p.resource}-${a}`}>
                <td>{p.resource}</td>
                <td>{a}</td>
                {roles.map((r) => (
                  <td key={`${r}-${p.resource}-${a}`}>—</td>
                ))}
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PermissionMatrix

