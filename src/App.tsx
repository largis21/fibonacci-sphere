import { useMemo, useRef } from 'react'
import './App.css'
import { Vector3 } from 'three';
import { Canvas } from "@react-three/fiber"
import { TrackballControls } from '@react-three/drei';

type Point3D = {
  x: number | null;
  y: number | null;
  z: number | null;
}

class FibSphereGenerator {
  private vertices: number
  public points: Point3D[]

  constructor() {
    this.vertices = 0
    this.points = []

    this.generatePoints()
  }

  generatePoints() {
    this.points = []
    for (let i = 0; i < this.vertices; i++) {
      this.points.push({ x: null, y: null, z: null })
    }
  }

  updatePoints(verticesCount: number): Point3D[] {
    if (this.vertices !== verticesCount) {
        this.vertices = verticesCount
        this.generatePoints()
    }

    const offset = 2 / this.vertices
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < this.vertices; i++) {
      const y = (i * offset - 1) + (offset / 2)
      const r = Math.sqrt(1 - y**2)
      const a = ((i - 1) % this.vertices) * increment
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r

      this.points[i] = { 
        x: x * 2,
        y: y * 2,
        z: z * 2
      }
    }

    return this.points
  }
}

function App() {

  const points = useMemo(() => {
    const generator = new FibSphereGenerator()
    return generator.updatePoints(200)
  }, [])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 23], fov: 20 }}>
        <ambientLight args={["white", 10]}/>
        <fog attach="fog" args={["#242424", 22, 25]}/>
        <Sphere points={points} />
      </Canvas>
    </div>
  )
}

function Sphere({
  points
}: {
  points: Point3D[]
}) {
  console.log(points)
  return (
    <>
      <TrackballControls rotateSpeed={5} dynamicDampingFactor={0.05} noZoom  />
        {points.map((point) => {
          if (
            !point.x ||
            !point.y ||
            !point.z
          ) return

          return <Point
            position={new Vector3(point.x, point.y, point.z)}
            color={(Math.random() - 0.5) > 0 ? "white" : "yellow"}
            size={Math.random() + .5}
          />
        })}
    </>
  )
}

function Point({
  position,
  color,
  size,
}: {
  position: Vector3
  color: string
  size: number
}) {
  const pointRef = useRef<THREE.Mesh>(null)

  return (
    <mesh
      ref={pointRef}
      position={position}
      scale={size}
    >
      <sphereGeometry args={[0.04, 64, 64]} />
      <meshBasicMaterial color={color}/>
    </mesh>
  )
}

export default App
